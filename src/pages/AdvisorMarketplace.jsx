import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { MobileNativeSelect } from "@/components/ui/mobile-native-select";
import { Users, MapPin, Award, GraduationCap, DollarSign, Phone, Mail, Globe, Star } from "lucide-react";

const ACCENT = "#00d4aa";

export default function AdvisorMarketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [scraping, setScraping] = useState(false);
  const [adminMode, setAdminMode] = useState(false);

  const { data: user } = useQuery({ queryKey: ["user"], queryFn: () => base44.auth.me() });

  const { data: advisors = [], isLoading, refetch } = useQuery({
    queryKey: ["advisors"],
    queryFn: () => base44.entities.Advisor.list("-featured", 50)
  });

  const handleScrapeAdvisors = async (url) => {
    setScraping(true);
    try {
      const response = await base44.functions.invoke('scrapeAdvisorData', { url });
      if (response.data.success) {
        alert(`Successfully imported ${response.data.inserted} advisors from ${response.data.source_url}`);
        refetch();
      } else {
        alert('Failed to import advisors');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setScraping(false);
  };

  const filteredAdvisors = advisors.filter(advisor => {
    const matchesSearch = advisor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         advisor.firm?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === "all" ? true : advisor.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  const regions = [...new Set(advisors.map(a => a.region).filter(Boolean))];
  const featured = filteredAdvisors.filter(a => a.featured);
  const regular = filteredAdvisors.filter(a => !a.featured);

  if (selectedAdvisor) {
    return (
      <div style={{ maxWidth: 800 }}>
        <button
          onClick={() => setSelectedAdvisor(null)}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: ACCENT, background: "none", border: "none", cursor: "pointer", marginBottom: "1.25rem", padding: 0 }}
        >
          ← Back to Advisors
        </button>

        <div className="t-card t-card-p" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Profile Header */}
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              {selectedAdvisor.profile_image_url && (
                <img src={selectedAdvisor.profile_image_url} alt={selectedAdvisor.name} style={{ width: 100, height: 100, borderRadius: "12px", objectFit: "cover" }} />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                  <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text-1)" }}>{selectedAdvisor.name}</h2>
                  {selectedAdvisor.featured && (
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "var(--gold)18", color: "var(--gold)", border: "1px solid var(--gold)30", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Star size={10} /> Featured
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "0.9375rem", color: "var(--text-2)", marginBottom: "0.75rem" }}>{selectedAdvisor.firm}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                  {selectedAdvisor.licenses?.map((license, i) => (
                    <span key={i} style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "20px", background: `${ACCENT}15`, color: ACCENT, border: `1px solid ${ACCENT}25` }}>{license}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Details */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              <div style={{ background: "var(--elevated)", borderRadius: "0.75rem", padding: "1rem", border: "1px solid var(--border-c)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                  <MapPin size={14} style={{ color: ACCENT }} />
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Location</span>
                </div>
                <p style={{ fontSize: "0.9375rem", color: "var(--text-1)" }}>{selectedAdvisor.region}</p>
              </div>
              <div style={{ background: "var(--elevated)", borderRadius: "0.75rem", padding: "1rem", border: "1px solid var(--border-c)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                  <GraduationCap size={14} style={{ color: "var(--blue)" }} />
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Education</span>
                </div>
                <p style={{ fontSize: "0.9375rem", color: "var(--text-1)" }}>{selectedAdvisor.education}</p>
              </div>
              <div style={{ background: "var(--elevated)", borderRadius: "0.75rem", padding: "1rem", border: "1px solid var(--border-c)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                  <DollarSign size={14} style={{ color: ACCENT }} />
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Fee Structure</span>
                </div>
                <p style={{ fontSize: "0.9375rem", color: "var(--text-1)" }}>{selectedAdvisor.fee_structure}</p>
                {selectedAdvisor.min_assets > 0 && <p style={{ fontSize: "0.75rem", color: "var(--text-3)", marginTop: 4 }}>Min. ${selectedAdvisor.min_assets.toLocaleString()} AUM</p>}
              </div>
              <div style={{ background: "var(--elevated)", borderRadius: "0.75rem", padding: "1rem", border: "1px solid var(--border-c)" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.375rem" }}>Experience</div>
                <p style={{ fontSize: "0.9375rem", color: "var(--text-1)" }}>{selectedAdvisor.years_experience} years</p>
              </div>
            </div>

            {selectedAdvisor.specialties?.length > 0 && (
              <div>
                <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-1)", marginBottom: "0.5rem" }}>Specialties</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                  {selectedAdvisor.specialties.map((s, i) => (
                    <span key={i} style={{ fontSize: "0.75rem", padding: "3px 10px", borderRadius: "20px", background: "var(--elevated)", color: "var(--text-2)", border: "1px solid var(--border-c)" }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {selectedAdvisor.accomplishments && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                  <Award size={14} style={{ color: "var(--gold)" }} />
                  <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-1)" }}>Accomplishments</span>
                </div>
                <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.65 }}>{selectedAdvisor.accomplishments}</p>
              </div>
            )}

            {selectedAdvisor.bio && (
              <div>
                <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-1)", marginBottom: "0.5rem" }}>About</div>
                <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.7 }}>{selectedAdvisor.bio}</p>
              </div>
            )}

            {/* Contact */}
            <div style={{ paddingTop: "1rem", borderTop: "1px solid var(--border-c)" }}>
              <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-1)", marginBottom: "0.75rem" }}>Contact</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {selectedAdvisor.phone && <a href={`tel:${selectedAdvisor.phone}`} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: ACCENT, textDecoration: "none", fontSize: "0.875rem" }}><Phone size={14} /> {selectedAdvisor.phone}</a>}
                {selectedAdvisor.email && <a href={`mailto:${selectedAdvisor.email}`} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: ACCENT, textDecoration: "none", fontSize: "0.875rem" }}><Mail size={14} /> {selectedAdvisor.email}</a>}
                {selectedAdvisor.website && <a href={selectedAdvisor.website} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: ACCENT, textDecoration: "none", fontSize: "0.875rem" }}><Globe size={14} /> Visit Website</a>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div className="t-card t-card-p" style={{ padding: "1.5rem", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          <div style={{ width: 44, height: 44, borderRadius: "12px", background: `${ACCENT}18`, border: `1px solid ${ACCENT}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Users size={20} style={{ color: ACCENT }} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.025em", color: "var(--text-1)" }}>
              Advisor <span style={{ color: ACCENT }}>Marketplace</span>
            </h1>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", marginTop: 2 }}>Connect with certified financial professionals in your area</p>
          </div>
        </div>
      </div>

      {/* Admin Panel */}
      {user?.role === "admin" && (
        <div className="t-card t-card-p" style={{ padding: "1.25rem", marginBottom: "1rem", borderColor: "var(--gold)25" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: adminMode ? "1rem" : 0 }}>
            <h3 style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--gold)" }}>Admin: Import Advisors</h3>
            <button onClick={() => setAdminMode(!adminMode)} style={{ fontSize: "0.8125rem", color: "var(--gold)", background: "none", border: "1px solid var(--gold)30", borderRadius: "0.375rem", padding: "0.25rem 0.625rem", cursor: "pointer" }}>
              {adminMode ? "Hide" : "Show"} Tools
            </button>
          </div>
          {adminMode && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.5rem" }}>
              {[
                { label: "Import from Ameriprise", url: "https://www.ameripriseadvisors.com/" },
                { label: "Import from LPL", url: "https://www.lpl.com/investors/find-an-advisor.html" },
                { label: "Import from Forbes", url: "https://www.forbes.com/advisor/l/top-financial-advisors/" },
                { label: "Import from Independent Advisors", url: "https://www.findyourindependentadvisor.com/find-a-local-advisor" },
              ].map((src, i) => (
                <button key={i} onClick={() => handleScrapeAdvisors(src.url)} disabled={scraping} style={{ padding: "0.5rem 0.75rem", borderRadius: "0.375rem", border: "1px solid var(--border-c)", background: "var(--elevated)", color: "var(--text-2)", fontSize: "0.8125rem", cursor: "pointer" }}>
                  {scraping ? "Importing..." : src.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search & Filter */}
      <div className="t-card t-card-p" style={{ padding: "1rem 1.25rem", marginBottom: "1.25rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.75rem" }}>
          <Input placeholder="Search by name or firm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ background: "var(--bg)", border: "1px solid var(--border-c)", color: "var(--text-1)" }} />
          <MobileNativeSelect
            value={regionFilter}
            onChange={setRegionFilter}
            placeholder="All Regions"
            options={[{ value: "all", label: "All Regions" }, ...regions.map(r => ({ value: r, label: r }))]}
            className="bg-[#0a0e17] border-[#1e293b] text-white"
          />
        </div>
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
            <Star size={16} style={{ color: "var(--gold)" }} />
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-1)" }}>Featured Advisors</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "0.875rem" }}>
            {featured.map(advisor => (
              <button key={advisor.id} onClick={() => setSelectedAdvisor(advisor)}
                style={{ background: "var(--surface)", border: `1px solid var(--gold)20`, borderRadius: "0.875rem", padding: "1.25rem", textAlign: "left", cursor: "pointer", transition: "border-color 0.15s, transform 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)40"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--gold)20"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ display: "flex", gap: "1rem" }}>
                  {advisor.profile_image_url && <img src={advisor.profile_image_url} alt={advisor.name} style={{ width: 56, height: 56, borderRadius: "10px", objectFit: "cover" }} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-1)", marginBottom: "0.2rem" }}>{advisor.name}</div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--text-3)", marginBottom: "0.375rem" }}>{advisor.firm}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.5rem" }}>
                      <MapPin size={11} style={{ color: "var(--text-3)" }} />
                      <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>{advisor.region}</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                      {advisor.licenses?.slice(0, 2).map((l, i) => (
                        <span key={i} style={{ fontSize: "0.625rem", padding: "1px 6px", borderRadius: "20px", background: `${ACCENT}12`, color: ACCENT }}>{l}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All Advisors */}
      <div>
        <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-1)", marginBottom: "0.875rem" }}>All Advisors</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.75rem" }}>
          {regular.map(advisor => (
            <button key={advisor.id} onClick={() => setSelectedAdvisor(advisor)}
              style={{ background: "var(--surface)", border: "1px solid var(--border-c)", borderRadius: "0.875rem", padding: "1.25rem", textAlign: "center", cursor: "pointer", transition: "border-color 0.15s, transform 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${ACCENT}30`; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-c)"; e.currentTarget.style.transform = "none"; }}
            >
              {advisor.profile_image_url && <img src={advisor.profile_image_url} alt={advisor.name} style={{ width: 68, height: 68, borderRadius: "50%", objectFit: "cover", margin: "0 auto 0.75rem" }} />}
              <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-1)", marginBottom: "0.25rem" }}>{advisor.name}</div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-3)", marginBottom: "0.5rem" }}>{advisor.firm}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem", marginBottom: "0.625rem" }}>
                <MapPin size={11} style={{ color: "var(--text-3)" }} />
                <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>{advisor.region}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", justifyContent: "center" }}>
                {advisor.licenses?.slice(0, 2).map((l, i) => (
                  <span key={i} style={{ fontSize: "0.625rem", padding: "1px 6px", borderRadius: "20px", background: "var(--blue)12", color: "var(--blue)" }}>{l}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {filteredAdvisors.length === 0 && !isLoading && (
        <div className="t-card t-card-p" style={{ padding: "3rem", textAlign: "center" }}>
          <Users size={40} style={{ color: "var(--text-3)", margin: "0 auto 1rem", opacity: 0.4 }} />
          <p style={{ fontSize: "0.875rem", color: "var(--text-3)" }}>No advisors found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
