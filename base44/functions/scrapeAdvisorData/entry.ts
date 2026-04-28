import { createClientFromRequest } from "npm:@base44/sdk@0.8.6";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== "admin") {
      return Response.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { url } = await req.json();

    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    // Fetch the website content
    const response = await fetch(url);
    const html = await response.text();

    // Use AI to extract advisor information from the page
    const advisorData = await base44.integrations.Core.InvokeLLM({
      prompt: `Extract financial advisor information from this website content. Return an array of advisor objects with as much information as available.

Website content:
${html.substring(0, 50000)}

Extract advisors with these fields (use null if not available):
- name (full name)
- firm (company/firm name)
- region (city, state, or geographic area)
- specialties (array of expertise areas)
- licenses (array like CFP, CPA, etc)
- education
- accomplishments
- fee_structure
- min_assets (number)
- years_experience (number)
- bio
- phone
- email
- website
- profile_image_url

Return as many real advisors as you can find from the page. If it's a search/directory page, extract sample advisors shown. Prioritize complete profiles.`,
      add_context_from_internet: false,
      response_json_schema: {
        type: "object",
        properties: {
          advisors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                firm: { type: "string" },
                region: { type: "string" },
                specialties: { type: "array", items: { type: "string" } },
                licenses: { type: "array", items: { type: "string" } },
                education: { type: "string" },
                accomplishments: { type: "string" },
                fee_structure: { type: "string" },
                min_assets: { type: "number" },
                years_experience: { type: "number" },
                bio: { type: "string" },
                phone: { type: "string" },
                email: { type: "string" },
                website: { type: "string" },
                profile_image_url: { type: "string" }
              }
            }
          },
          source_url: { type: "string" }
        }
      }
    });

    // Insert advisors into database
    const inserted = [];
    for (const advisor of advisorData.advisors) {
      if (advisor.name && advisor.firm) {
        try {
          const created = await base44.asServiceRole.entities.Advisor.create(advisor);
          inserted.push(created);
        } catch (error) {
          console.error(`Failed to insert ${advisor.name}:`, error);
        }
      }
    }

    return Response.json({ 
      success: true,
      source_url: url,
      extracted: advisorData.advisors.length,
      inserted: inserted.length,
      advisors: inserted
    });

  } catch (error) {
    console.error("Error scraping advisor data:", error);
    return Response.json({ 
      error: error.message || "Failed to scrape advisor data" 
    }, { status: 500 });
  }
});