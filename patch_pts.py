import re

with open('src/components/PusatInformasiView.tsx', 'r') as f:
    content = f.read()

# Add state for PTS
content = content.replace("const [openAgenda, setOpenAgenda] = useState(false);",
                          "const [openAgenda, setOpenAgenda] = useState(false);\n  const [openPTS, setOpenPTS] = useState(false);")

# Replace PTS button with the new structure
pts_button = """              <button onClick={() => handleDevAlert('PTS')} className="w-full text-left pl-12 pr-4 py-3 hover:bg-slate-100 text-slate-700 border-b border-slate-200/50 text-sm font-semibold flex items-center">
                <CheckCircle className="w-4 h-4 mr-3 text-sky-500" /> PTS
              </button>"""

pts_new = """              <div>
                <button onClick={() => setOpenPTS(!openPTS)} className="w-full text-left pl-12 pr-4 py-3 hover:bg-slate-100 text-slate-700 border-b border-slate-200/50 text-sm font-semibold flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-3 text-sky-500" /> PTS
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openPTS ? 'rotate-90' : ''}`} />
                </button>
                {openPTS && (
                  <div className="bg-slate-100 flex flex-col w-full border-b border-slate-200/50">
                    <a 
                      href="https://docs.google.com/spreadsheets/d/15tta_PsY4miwXhdfCWKYgfDBYgZ2osnb/edit?usp=sharing&ouid=104750660565674717341&rtpof=true&sd=true" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-full text-left pl-16 pr-4 py-2.5 hover:bg-slate-200 text-xs text-slate-700 border-b border-slate-200/50 font-bold block"
                    >
                      Format Penilaian
                    </a>
                  </div>
                )}
              </div>"""

content = content.replace(pts_button, pts_new)

with open('src/components/PusatInformasiView.tsx', 'w') as f:
    f.write(content)
