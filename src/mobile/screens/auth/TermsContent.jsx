import { C, UI, DISPLAY, MONO } from '../../tokens'

const H1 = ({ children }) => (
  <div style={{ fontFamily:DISPLAY, fontSize:20, fontWeight:700, color:C.t1, marginBottom:6, marginTop:24, lineHeight:1.2 }}>{children}</div>
)
const H2 = ({ children }) => (
  <div style={{ fontFamily:UI, fontSize:14, fontWeight:700, color:C.t1, marginBottom:5, marginTop:18 }}>{children}</div>
)
const P = ({ children }) => (
  <p style={{ fontFamily:UI, fontSize:13, color:'#4a4035', lineHeight:1.75, margin:'0 0 10px' }}>{children}</p>
)
const UL = ({ items }) => (
  <ul style={{ margin:'0 0 12px', paddingLeft:20 }}>
    {items.map((item,i) => (
      <li key={i} style={{ fontFamily:UI, fontSize:13, color:'#4a4035', lineHeight:1.7, marginBottom:4 }}>{item}</li>
    ))}
  </ul>
)
const Divider = () => <div style={{ height:1, background:'#e8e0d4', margin:'20px 0' }} />

export default function TermsContent() {
  return (
    <div style={{ padding:'0 4px' }}>

      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:24 }}>
        <div style={{ fontFamily:UI, fontSize:10, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:C.indigo, marginBottom:8 }}>
          Financial Understanding Network
        </div>
        <div style={{ fontFamily:DISPLAY, fontSize:22, fontWeight:700, color:C.t1, lineHeight:1.2, marginBottom:6 }}>
          Terms of Use & Privacy Policy
        </div>
        <div style={{ fontFamily:UI, fontSize:11, color:'#8a7a68' }}>Last Updated: July 2026</div>
      </div>

      {/* Part 1 */}
      <H1>Part 1 — Educational Use & Financial Disclaimer</H1>

      <H2>1.1 About This Document</H2>
      <P>
        This document governs your use of FUN — the Financial Understanding Network — which is part of the Planora ecosystem. By creating an account or using the App, you agree to the terms set out below. Please read them carefully. If you do not agree, please do not use the App.
      </P>
      <P>
        FUN is an educational platform. Everything in the App — lessons, calculators, guides, assessments, and planning tools — is designed purely to help you learn about personal finance. It is not a financial product, advisory service, or investment platform.
      </P>

      <H2>1.2 We Do Not Provide Financial Advice</H2>
      <P>
        FUN does not provide financial, investment, tax, legal, accounting, or professional advice of any kind. We are not a financial advisor, broker, dealer, planner, or fiduciary, and no relationship of that nature is created by your use of the App.
      </P>
      <P>
        The content in FUN is general in nature and is not tailored to your personal financial situation, goals, risk tolerance, or circumstances.
      </P>

      <H2>1.3 We Do Not Make Recommendations</H2>
      <P>FUN does not recommend, endorse, promote, or suggest that you buy, sell, hold, or take any action regarding any specific:</P>
      <UL items={[
        'security, stock, bond, fund, or investment product;',
        'cryptocurrency or digital asset;',
        'bank, lender, brokerage, or financial institution;',
        'insurance product, loan, or credit arrangement; or',
        'financial strategy or transaction of any kind.',
      ]} />
      <P>
        Any names, figures, scenarios, or examples used in the App are purely illustrative and included only to explain a concept. They should never be read as a recommendation or as an indication of what you personally should do.
      </P>

      <H2>1.4 Always Consult a Qualified Professional</H2>
      <P>
        Before making any financial decision, you should seek advice from a licensed and qualified professional — such as a certified financial planner, registered investment advisor, accountant, or attorney — who can consider your individual circumstances.
      </P>
      <P>
        You are solely responsible for any decisions you make and any actions you take. You use the information in FUN entirely at your own discretion and risk. To the fullest extent permitted by law, we accept no liability for any loss or harm arising from reliance on the App's educational content.
      </P>

      <H2>1.5 No Guarantees of Outcomes</H2>
      <P>
        Financial markets and personal finances are inherently uncertain. Nothing in FUN guarantees any particular result, return, saving, or financial outcome. Past performance and historical examples are never a reliable indicator of future results.
      </P>

      <Divider />

      {/* Part 2 */}
      <H1>Part 2 — Privacy & Data Protection</H1>
      <P>
        Your trust matters to us, and protecting the information you share with FUN is a responsibility we take seriously. This section explains what we collect, why, and how we keep it safe.
      </P>

      <H2>2.1 Information We Collect</H2>
      <P>Depending on how you use the App, we may collect the following:</P>
      <P><strong>Information you provide directly:</strong></P>
      <UL items={[
        'Account details such as your name, username, and email address.',
        'Profile preferences and settings you choose within the App.',
        'Learning progress, saved lessons, quiz results, and bookmarks.',
        'Messages, feedback, or support requests you send us.',
      ]} />
      <P><strong>Information collected automatically:</strong></P>
      <UL items={[
        'Device and technical data such as device type, operating system, app version, and general usage patterns.',
        'Anonymous or aggregated analytics that help us understand which lessons are helpful and how the App is performing.',
      ]} />
      <P>
        We do not require, and we discourage you from entering, sensitive personal financial data — such as account numbers, card details, or login credentials for third-party financial services — because FUN is an educational tool and has no need for it.
      </P>

      <H2>2.2 How We Use Your Information</H2>
      <P>We use the information we collect only for legitimate purposes that support your learning experience, including to:</P>
      <UL items={[
        'create and maintain your account;',
        'save and personalize your learning progress;',
        'operate, maintain, and improve the App and its educational content;',
        'respond to your questions and provide support;',
        'keep the App secure and prevent misuse or fraud; and',
        'comply with our legal obligations.',
      ]} />
      <P>
        We will never sell your personal information. We do not trade or rent your data to advertisers or data brokers.
      </P>

      <H2>2.3 How We Protect Your Information</H2>
      <P>We apply a layered approach to security across every place your data is stored and transmitted:</P>
      <UL items={[
        'Encryption in transit: Data moving between your device and our servers is protected using industry-standard TLS/HTTPS encryption.',
        'Encryption at rest: Information stored on our servers is safeguarded using strong encryption.',
        'Secure infrastructure: Our servers are hosted with reputable providers that maintain robust physical and network security, including firewalls, monitoring, and access controls.',
        'Access restrictions: Access to your information is strictly limited to authorized personnel and governed by internal controls.',
        'Ongoing monitoring: We monitor our systems for vulnerabilities, apply security updates, and work to detect and respond to potential threats promptly.',
        'Data minimization: We collect only what we reasonably need to provide the App.',
      ]} />
      <P>
        While no method of transmission or storage over the internet can be guaranteed to be 100% secure, we are committed to using commercially reasonable and industry-standard measures to protect your information.
      </P>

      <H2>2.4 Data Retention</H2>
      <P>
        We keep your personal information only for as long as it is needed to provide the App, fulfill the purposes described in this policy, or comply with our legal obligations. When information is no longer needed, we take reasonable steps to securely delete or anonymize it.
      </P>

      <H2>2.5 Sharing of Information</H2>
      <P>We share information only in limited, necessary circumstances:</P>
      <UL items={[
        'Trusted service providers who help us operate the App (for example, hosting, storage, or analytics providers), who are bound to protect your information and use it only for the services they provide to us.',
        'Legal and safety reasons, where disclosure is required by law, regulation, or legal process, or to protect the rights, safety, and security of our users or the public.',
        'Business transfers, such as a merger, acquisition, or sale of assets, in which case we will take reasonable steps to ensure your information remains protected.',
      ]} />
      <P>
        We do not share your personal information for third-party advertising or marketing purposes.
      </P>

      <H2>2.6 Your Rights and Choices</H2>
      <P>
        Depending on your location, you may have rights over your personal information, including the right to access, correct, delete, or restrict its use. California residents may have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect and the right to opt out of its sale — which we do not engage in.
      </P>
      <P>
        You can exercise your rights, or ask any questions, by contacting us using the details in the Contact Us section below. You may also update your information directly within the App's settings and delete your account at any time.
      </P>

      <H2>2.7 Children's Privacy</H2>
      <P>
        FUN is intended for a general audience interested in financial education. We do not knowingly collect personal information from children under the age of 13 without appropriate parental consent, in compliance with the Children's Online Privacy Protection Act (COPPA). If you believe a child has provided us with personal information, please contact us so we can take appropriate steps to remove it.
      </P>

      <H2>2.8 Third-Party Links and Content</H2>
      <P>
        The App may occasionally reference or link to third-party websites, tools, or resources for educational context. We are not responsible for the content, accuracy, or privacy practices of those third parties. We encourage you to review their policies before engaging with them.
      </P>

      <Divider />

      {/* Part 3 */}
      <H1>Part 3 — Terms of Use</H1>

      <H2>3.1 Acceptance of Terms</H2>
      <P>
        By creating an account or using FUN, you agree to these Terms of Use. If you do not agree, please do not use the App.
      </P>

      <H2>3.2 Eligibility</H2>
      <P>
        You must be at least 13 years of age to use FUN. Users under the age of majority in their jurisdiction must have the consent of a parent or legal guardian.
      </P>

      <H2>3.3 Acceptable Use</H2>
      <P>You agree to use FUN only for lawful, personal, educational purposes. You agree not to:</P>
      <UL items={[
        'misuse, disrupt, or attempt to gain unauthorized access to the App or its servers;',
        'copy, reproduce, distribute, or resell the App\'s content without permission;',
        'reverse-engineer or interfere with the App\'s security features; or',
        'use the App in any way that violates applicable laws or the rights of others.',
      ]} />

      <H2>3.4 Intellectual Property</H2>
      <P>
        All content within FUN — including text, lessons, graphics, logos, and design — is owned by or licensed to us and is protected by intellectual property laws. You are granted a limited, non-exclusive, non-transferable license to access and use the App for your own personal, educational use only.
      </P>

      <H2>3.5 Disclaimer of Warranties</H2>
      <P>
        FUN is provided on an "as is" and "as available" basis. To the fullest extent permitted by law, we make no warranties of any kind, whether express or implied, regarding the App, its content, its accuracy, or its availability. Educational content may contain simplifications or general information that does not reflect every situation.
      </P>

      <H2>3.6 Limitation of Liability</H2>
      <P>
        To the fullest extent permitted by law, FUN and its owners, operators, and affiliates shall not be liable for any indirect, incidental, consequential, or special damages, or for any financial loss or decision, arising out of or related to your use of — or inability to use — the App or its educational content.
      </P>

      <H2>3.7 Changes to the App and These Terms</H2>
      <P>
        We may update, modify, or discontinue features of the App, and we may revise this document from time to time. When we make material changes, we will update the "Last Updated" date and, where appropriate, notify you within the App. Your continued use of FUN after changes take effect constitutes your acceptance of the updated terms.
      </P>

      <H2>3.8 Governing Law</H2>
      <P>
        These Terms are governed by the laws of the United States and the state in which Planora operates, without regard to conflict-of-law principles.
      </P>

      <Divider />

      {/* Contact */}
      <H1>Contact Us</H1>
      <P>
        If you have any questions, concerns, or requests regarding this policy, your data, or these terms, please contact us:
      </P>
      <div style={{ background:'#f5f0e8', borderRadius:12, padding:'14px 16px', marginBottom:16 }}>
        <div style={{ fontFamily:UI, fontSize:13, fontWeight:700, color:C.t1, marginBottom:4 }}>FUN — Financial Understanding Network</div>
        <div style={{ fontFamily:UI, fontSize:12, color:'#4a4035', lineHeight:1.7 }}>Part of the Planora Ecosystem</div>
        <div style={{ fontFamily:UI, fontSize:12, color:'#4a4035', lineHeight:1.7 }}>Email: contact@planora.app</div>
      </div>

      <div style={{ background:'#f5f0e8', borderRadius:12, padding:'12px 16px', marginBottom:8 }}>
        <div style={{ fontFamily:UI, fontSize:11, color:'#8a7a68', lineHeight:1.65, fontStyle:'italic' }}>
          FUN — the Financial Understanding Network — is an educational platform. It does not provide financial advice or recommendations. Its purpose is solely to help you learn and understand.
        </div>
      </div>

    </div>
  )
}
