import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';

const KYCForm = () => {
  const formRef = useRef();
  const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
  const [logo, setLogo] = useState(null);
  const [checkboxAnswers, setCheckboxAnswers] = useState({
    q1: "",
    q2: "",
    q3: ""
  });

  const [documentChecks, setDocumentChecks] = useState({
    passport: '',
    visa: '',
    emiratesId: '',
    uaeId: '',
    tenancy: '',
    sourceFund: ''
  });
  
  const handleDocCheck = (field, value) => {
    setDocumentChecks(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };

  const Page = ({ children }) => (
  <div
    style={{
      width: '100%',
      minHeight: '1050px', // A4 height in px
      border: '1px solid black',
      marginTop:'10px',
      marginBottom:'20px',
      padding: '30px',
      boxSizing: 'border-box',
      pageBreakAfter: 'always',
    }}
  >
    {children}
  </div>
);
const handleDownloadPDF = () => {
  const element = formRef.current;

  // A4 height roughly = 1123px per page
  const pageCountEstimate = Math.ceil(element.scrollHeight / 1123);
  const watermarkContainer = document.createElement('div');
  watermarkContainer.style.position = 'absolute';
  watermarkContainer.style.top = '0';
  watermarkContainer.style.left = '0';
  watermarkContainer.style.width = '100%';
  watermarkContainer.style.height = '100%';
  watermarkContainer.style.zIndex = '9999';
  watermarkContainer.style.pointerEvents = 'none';

  for (let i = 0; i < pageCountEstimate; i++) {
    const wm = document.createElement('div');
    wm.innerText = 'KYC FORM';
    Object.assign(wm.style, {
      position: 'absolute',
      top: `${i * 1123 + 500}px`, // place in center of each page
      left: '50%',
      transform: 'translate(-50%, -50%) rotate(-45deg)',
      fontSize: '60px',
      color: 'rgba(150, 150, 150, 0.2)',
      whiteSpace: 'nowrap',
    });
    watermarkContainer.appendChild(wm);
  }

  element.appendChild(watermarkContainer);

  const opt = {
    margin: 0,
    filename: 'KYC_Form.pdf',
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf()
    .set(opt)
    .from(element)
    .toPdf()
    .get('pdf')
    .then(function (pdf) {
      const totalPages = pdf.internal.getNumberOfPages();
      if (totalPages === 6) {
        pdf.deletePage(totalPages);
      }
      pdf.save('KYC_Form.pdf');

      // Remove watermark after saving
      element.removeChild(watermarkContainer);
    });
};


  return (
    <div >
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <button
          onClick={handleDownloadPDF}
          style={{ backgroundColor: '#2563eb',color:'#fff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer'}}
        >
          Download PDF
        </button>
      </div>

      {/* Form Starts */}
      <div
  ref={formRef}
  style={{
    width: '794px',
    minHeight: '1123px',
    margin: '0 auto',
    backgroundColor: '#fff',
    padding: '40px',
    overflow:'hidden',
    paddingBottom:'0px',
    paddingTop:'25px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    position: 'relative',
    boxSizing: 'border-box',
    color: '#1e3a8a'
  }}
>
    <Page>
        {/* Logo Upload */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          {logo ? (
            <img src={logo} alt="Uploaded Logo" style={{ height: '80px', objectFit: 'contain' }} />
          ) : (
            <label style={{ cursor: 'pointer', color: '#2563eb', textDecoration: 'underline' }}>
              Upload Logo
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
            </label>
          )}
        </div>

        {/* Title */}
        <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>NATURAL PERSON – KYC FORM</h2>

        {/* Sections */}
        <Section title="CUSTOMER INFORMATION">
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black',marginBottom: '24px'}}>
            <tbody>
              {[
                ["UID No (for our Office Use)", "uid"],
                ["Customer Name", "customerName"],
                ["Nationality", "nationality"],
                ["Date of Birth", "dob"],
                ["Place of Birth", "birthPlace"],
                ["Country of Residence", "residence"],
                ["Contact Number", "contact"],
                ["Email Address", "email"],
                ["Residential Address", "residential"],
                ["UAE Resident Address", "uaeAddress"],
                ["Profession", "profession"],
                ["Employer/Business name", "employer"],
              ].map(([label, name]) => (
                <tr key={name}>
                  <td style={{ padding: '8px', border: '1px solid black', fontWeight: '500', textAlign: 'left', verticalAlign: 'top', width: '50%' }}>{label}</td>
                  <td style={{ padding: '8px', border: '1px solid black', textAlign: 'left', verticalAlign: 'top', width: '50%' }}>
                  <input
  type={name === 'dob' ? 'date' : 'text'}
  name={name}
  style={{
    width: '100%',
    fontSize: '14px',
    minHeight: "15px",
    lineHeight: '2',  // Make border visible in PDF
  }}
/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="IDENTITY DETAILS">
          <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', border: '1px solid black' }}>
            <tbody>
              <tr>
                <td style={cellStyle}>ID TYPE</td>
                <td style={cellStyle}><input type="text" name="idType" style={inputStyle} /></td>
                <td style={cellStyle}>ID NO</td>
                <td style={cellStyle}><input type="text" name="idNo" style={inputStyle} /></td>
              </tr>
              <tr>
                <td style={cellStyle}>ID Issue Date</td>
                <td style={cellStyle}><input type="date" name="issueDate" style={inputStyle} /></td>
                <td style={cellStyle}>ID Expiry Date</td>
                <td style={cellStyle}><input
  type="date"
  name="expiryDate"
  style={inputStyle}
  min={tomorrow.toISOString().split("T")[0]}
/></td>
              </tr>
              <tr>
  <td style={cellStyle}>Place of Issue</td>
  <td style={cellStyle}>
    <div style={{ display: 'flex', flexDirection: 'column',width:'100%' }}>
      <input maxLength={13} type="text" name="issuePlace1" style={inputStyle} />
      <input maxLength={13} type="text" name="issuePlace2" style={inputStyle} />
    </div>
  </td>
  <td style={cellStyle}>ID Issuing Authority</td>
  <td style={cellStyle}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px',width:'95%' }}>
      <input maxLength={13} type="text" name="idAuthority1" style={inputStyle} />
      <input maxLength={13} type="text" name="idAuthority2" style={inputStyle} />
    </div>
  </td>
</tr>
            </tbody>
          </table>
        </Section>
        </Page>
        <Page>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px'}}>
          <img src={logo} alt="Uploaded Logo" style={{ height: '80px', objectFit: 'contain' }} />
        </div>
        <Section title="AML/CFT -KYC QUESTIONNAIRE">
          <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', border: '1px solid black' }}>
            <tbody>
              {[
                {
                  label: "a.",
                  question: 'Is the customer a Politically Exposed Person (\u201cPEP\u201d)?',
                  name: 'q1',
                },
                {
                  label: "b.",
                  question: (
                    <>
                      Is the customer or business subject to financial Sanctions/or connected with Prescribed Terrorist organizations?
                      <br />
                      If yes, please specify:
                      <input
                        type="text"
                        name="q2_text"
                        style={{ width: '70%', marginTop: '4px', borderBottom: '1px dotted black', padding: '4px', fontSize: '14px',
                          minHeight: "15px",
                          lineHeight: '2', }}
                      />
                    </>
                  ),
                  name: 'q2',
                },
                {
                  label: "c.",
                  question: 'Is the customer based in or associated to any high-risk jurisdictions?',
                  name: 'q3',
                },
                {
                  label: "d.",
                  question: (
                    <>
                      Does the customer have dual nationality?<br />
                      If so, please document and ensure copies of dual ID also obtained?
                    </>
                  ),
                  name: 'q4',
                },
                {
                  label: "e.",
                  question: (
                    <>
                      Is the customer involving or controlling any trust or charities?<br />
                      If yes, please specify:
                      <input
                        type="text"
                        name="q5_text"
                        style={{ width: '70%', marginTop: '4px', borderBottom: '1px dotted black', padding: '4px', fontSize: '14px',
                          minHeight: "15px",
                          lineHeight: '2', }}
                      />
                    </>
                  ),
                  name: 'q5',
                },
                {
                  label: "f.",
                  question: 'Explanations/evidence obtained of source of funds and/or source of wealth',
                  name: 'q6',
                  customInput: (
                    <input
                      type="text"
                      name="sourceOfWealth"
                      defaultValue="Personal Savings"
                      style={{ width: '60%', padding: '6px', fontSize: '14px', border: 'none' }}
                    />
                  )
                }
              ].map(({ label, question, name }, idx) => (
                <tr key={idx}>
                  <td style={{ ...cellStyle, width: '5%', fontWeight: '500' }}>{label}</td>
                  <td style={{ ...cellStyle, width: '65%' }}>{question}</td>
                  <td style={{ ...cellStyle, width: '30%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
  {["Yes", "No", "N/A"].map((opt, i) => (
    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <input
        type="checkbox"
        name={name}
        value={opt.toLowerCase()}
        checked={checkboxAnswers[name] === opt.toLowerCase()}
        onChange={() =>
          setCheckboxAnswers((prev) => ({
            ...prev,
            [name]: opt.toLowerCase(),
          }))
        }
        style={{ width: '16px', height: '16px' }}
      />
      <label style={{marginBottom:'10px'}}>{opt}</label>
    </div>
  ))}
</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
        </Page>
        <Page>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px'}}>
          <img src={logo} alt="Uploaded Logo" style={{ height: '80px', objectFit: 'contain' }} />
        </div>
        <Section customTitle={
  <div style={{ border: '1px solid black',fontSize: '13px'}}>

    {/* FOR OFFICE USE ONLY Header */}
    <h3 style={{
      backgroundColor: '#fde047',
      fontWeight: 'bold',
      padding: '8px',
      fontSize: '14px',
      borderBottom: '1px solid black',
      textAlign: 'center',
    }}>
      FOR OFFICE USE ONLY
    </h3>

    {/* Compliance Section */}
    <div style={{ padding: '16px', paddingBottom:'0px' }}>
      <p>Compliance Department Remarks</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '10px' }}>
  <input
    type="text"
    style={{
      border: 'none',
      borderBottom: '1px solid black',
      width: '100%',
      lineHeight:'2',
      fontSize: '14px',
      color: '#0b2546',
    }}
  />
  <input
    type="text"
    style={{
      border: 'none',
      borderBottom: '1px solid black',
      width: '100%',
      lineHeight:'2',
      fontSize: '14px',
      color: '#0b2546',
    }}
  />
  <input
    type="text"
    style={{
      border: 'none',
      borderBottom: '1px solid black',
      width: '100%',
      lineHeight:'2',
      fontSize: '14px',
      color: '#0b2546',
    }}
  />
</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <span style={{marginTop:'4px'}}  >Approved:</span>
        <input type="checkbox" style={{...boxStyle,marginTop:'10px'}} />
        <label> Yes</label>
        <input type="checkbox" style={{...boxStyle,marginTop:'10px'}} /> 
        <label>No</label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ width: '48%' }}>
          <span>Compliance Officer Name:</span>
          <input type="text" style={{ border: 'none', borderBottom: '1px solid black', width: '80%', color: '#0b2546',marginTop:'10px',lineHeight:'2', }} />
        </div>
        <div style={{ width: '48%' }}>
          <span>Signature:</span>
          <input type="text" style={{ border: 'none', borderBottom: '1px solid black', width: '84%', color: '#0b2546',marginTop:'10px' ,lineHeight:'2',}} />
        </div>
      </div>
    </div>

    {/* Senior Management Approval Section */}
    <div style={{ borderTop: '1px solid black', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'left', gap: '12px', marginBottom: '10px' }}>
        <strong>SENIOR MANAGEMENT APPROVAL STATUS:</strong>
        <input type="checkbox" style={{...boxStyle,marginTop:'8px'}} />
        <label> Yes</label>
        <input type="checkbox" style={{...boxStyle,marginTop:'8px'}} /> 
        <label>No</label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div>
          Name:
          <input type="text" style={{ border: 'none',  width: '80%', color: '#0b2546',lineHeight:'2',paddingLeft:'8px'}} />
        </div>
        <div>
          Signature:
          <input type="text" style={{ border: 'none',  width: '80%', color: '#0b2546',lineHeight:'2',paddingLeft:'8px' }} />
        </div>
        <div>
          Designation:
          <input type="text" style={{ border: 'none',  width: '71%', color: '#0b2546',lineHeight:'2',paddingLeft:'8px' }} />
        </div>
        <div>
          Stamp:
          <input type="text" style={{ border: 'none',  width: '86%', color: '#0b2546',lineHeight:'2',paddingLeft:'8px' }} />
        </div>
        <div>
          Date:
          <input type="text" style={{ border: 'none', width: '84%',color: '#0b2546',lineHeight:'2',paddingLeft:'8px' }} />
        </div>
      </div>
    </div>
  </div>
} />

<Section customTitle={
  <h3 style={{
    fontWeight: 'bold',
    fontSize: '14px',
    marginBottom: '16px',
    textDecoration: 'underline',
    textUnderlineOffset: '10px',
  }}>DECLARATIONS
  </h3>}>
  <div style={{marginBottom:'20px'}}>
  <div style={{ padding: '8px', fontSize: '13px', lineHeight: '1.6' ,textAlign:'justify'}}>
    <h4 style={{ fontWeight: 'bold', textDecoration: 'underline',textUnderlineOffset: '10px', marginBottom: '8px' }}>Source of Fund Declaration</h4>
    <p style={{paddingBottom:'18px'}}>
      I acknowledge and understand that in order to register with <strong>Bait Al Safa Gold & Diamonds L.L.C</strong>, 
      I am required to declare the source of funds that will be used for the stated purpose in this application. 
      I am aware of the legal requirements outlined in the federal decree-law No. (20) of 2018 on Anti-Money Laundering and 
      Combating the Financing of Terrorism and Financing of Illegal Organizations, as well as the Cabinet Decision No. (10) of 2019, 
      which specifies the implementing regulations for the aforementioned decree-law.
    </p>
    <p style={{paddingBottom:'18px'}}>
      I hereby confirm that the funds or metals I possess have been acquired from legitimate sources, 
      and I can provide evidence to support this if required or as requested. Furthermore, I affirm that these funds or metals 
      do not originate from any sanctioned country, entity, or person as identified by the United Nations or any other relevant 
      sanction programs.
    </p>
    <p style={{paddingBottom:'18px'}}>
      I assure that I am fully compliant with both domestic and international laws, rules, and regulations, 
      including those pertaining to the illicit trade in precious metals and the United Nations Security Council (UNSC) sanctions. 
      Additionally, I guarantee that the sources of the precious metals I possess are free from any involvement in conflict financing, 
      criminal funding, the worst forms of child labor, and human rights abuses.
    </p>
    </div>
    </div>
    </Section>
    </Page>
    <Page>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img src={logo} alt="Uploaded Logo" style={{ height: '80px', objectFit: 'contain' }} />
    </div>
    <div>
    <div style={{ padding: '8px',paddingTop:'0px', fontSize: '13px', lineHeight: '1.6' ,textAlign:'justify'}}>
    <h4 style={{ fontWeight: 'bold', textDecoration: 'underline',textUnderlineOffset: '10px', marginBottom: '8px', marginTop:'10px'}}>
      Politically Exposed Person (PEP) Declaration
    </h4>
    <p style={{paddingBottom:'18px'}}>
      I am writing to you in my capacity as valued customers of <strong>Bait Al Safa Gold & Diamonds L.L.C</strong>. 
      As part of your robust anti-money laundering (AML) and know your customer (KYC) procedures, I understand that it is necessary 
      for us to provide a declaration regarding our status as Politically Exposed Persons (PEPs).
    </p>
    <p style={{paddingBottom:'18px'}}>
      I hereby confirm that, to the best of our knowledge and belief, I am not considered Politically Exposed Persons as 
      defined by the applicable laws and regulations. I, as individuals, have not held any prominent public positions, such as 
      government officials, heads of state, or senior members of political parties, either in our home country or in any other jurisdiction.
    </p>
    <p style={{paddingBottom:'18px'}}>
      I further declare that I do not have any immediate family members or close associates who fall under the category 
      of Politically Exposed Persons.
    </p>
    <p style={{paddingBottom:'18px'}}>
      I understand the importance of maintaining high standards of integrity and transparency in financial transactions, 
      and I assure you that all funds and activities conducted through <strong>Bait Al Safa Gold & Diamonds L.L.C</strong> 
      will be in full compliance with all applicable laws and regulations.
    </p>

    <h4 style={{ fontWeight: 'bold', textDecoration: 'underline',textUnderlineOffset: '10px', marginBottom: '8px' }}>
      Sanction Declaration
    </h4>
    <p style={{paddingBottom:'18px'}}>
      I affirm that I refrain from engaging in transactions with countries subject to sanctions by the Financial Action Task Force (FATF) 
      and the Office of Foreign Assets Control (OFAC). I am committed to conducting all my business operations without prior involvement 
      or future dealings with countries listed on a Sanctions List or located in a Sanctioned Country.
    </p>
    <p style={{paddingBottom:'18px'}}>
      I am dedicated to ensuring that my activities uphold compliance with economic or financial sanctions and trade regulations imposed 
      by the authorities, including but not limited to the United Arab Emirates (UAE), United States (US), European Union (EU), 
      United Kingdom (UK), and other relevant jurisdictions. I affirm that my understanding of these regulations is in line with 
      the latest changes and applicable laws and regulations, reflecting my unwavering commitment to maintaining the highest ethical 
      standards in all aspects of business practices.
    </p>
    <p><strong>I hereby declare the above information to be true and accurate to the best of our knowledge.</strong></p>
  </div>
  </div>
<Section
 customTitle={
  <h3 style={{
    backgroundColor: '#fde047',
    color: '#000',
    fontWeight: 'bold',
    padding: '8px',
    fontSize: '14px',
    border: '1px solid black',
    textAlign: 'center'
  }}>
    DOCUMENTS CHECKLIST
  </h3>
}>
  <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', border: '1px solid black', fontSize: '14px' }}>
    <tbody>
      {[
        ["a.", "Passport copy", "passport"],
        ["b.", "Valid Visa copy", "visa"],
      ].map(([label, question, key], idx) => (
        <tr key={idx}>
          <td style={{ ...cellStyle, width: '5%', fontWeight: '500' }}>{label}</td>
          <td style={{ ...cellStyle, width: '65%' }}>{question}</td>
          <td style={{ ...cellStyle, width: '30%' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {["Yes", "No", "N/A"].map((opt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                    type="checkbox"
                    checked={documentChecks[key] === opt}
                    onChange={() => handleDocCheck(key, opt)}
                    style={{ width: '16px', height: '16px' }}
                  />
      <label style={{marginBottom:'10px'}}>{opt}</label>
    </div>
              ))}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</Section>
</Page>
<Page>
<div >
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img src={logo} alt="Uploaded Logo" style={{ height: '80px', objectFit: 'contain' }} />
    </div>
  <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', border: '1px solid black', fontSize: '14px' }}>
    <tbody>
      {[
        ["c.", "Emirates ID copy", "emiratesId"],
        ["d.", "UAE National ID copy", "uaeId"],
        ["e.", "Tenancy Contract/Utility Bill copy", "tenancy"],
        ["f.", "Source of Fund (ex. Bank statement)", "sourceFund"]
      ].map(([label, question, key], idx) => (
        <tr key={idx}>
          <td style={{ ...cellStyle, width: '5%', fontWeight: '500' }}>{label}</td>
          <td style={{ ...cellStyle, width: '65%' }}>{question}</td>
          <td style={{ ...cellStyle, width: '30%' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {["Yes", "No", "N/A"].map((opt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                    type="checkbox"
                    checked={documentChecks[key] === opt}
                    onChange={() => handleDocCheck(key, opt)}
                    style={{ width: '16px', height: '16px',color:'black' }}
                  />
      <label style={{marginBottom:'10px'}}>{opt}</label>
    </div>
              ))}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  {/* Signature Area */}
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid black', marginTop:'50px' }}>
    {["Customer’s Full Name", "Signature", "Date"].map((label, index) => (
      <React.Fragment key={index}>
        <div style={{ borderRight: '1px solid black', borderTop: '1px solid black', padding: '12px' }}>{label}</div>
        <div style={{ borderTop: '1px solid black', padding: '12px' }}></div>
      </React.Fragment>
    ))}
  </div>
</div>
    </Page>
      </div>
    </div>
  );
};

const Section = ({ title, children, customTitle }) => (
  <div style={{ textAlign: 'center' }}>
    {customTitle ? customTitle : (
      <h3 style={{
        backgroundColor: '#fde047',
        color: '#000',
        fontWeight: 'bold',
        padding: '8px',
        border: '1px solid black',
        fontSize: '14px'
      }}>{title}</h3>
    )}
    <div style={{ textAlign: 'left', display: 'inline-block', width: '100%' }}>{children}</div>
  </div>
);


const cellStyle = {
  border: '1px solid black',
  padding: '8px',
  verticalAlign: 'top'
};

const boxStyle = {
  width: '16px',
  height: '16px',
  marginRight: '6px'
};

const inputStyle = {
  width: '100%',
  fontSize: '14px',
  minHeight: "15px",
  lineHeight: '2',
  outline: 'none',
  border: 'none'
};

export default KYCForm;