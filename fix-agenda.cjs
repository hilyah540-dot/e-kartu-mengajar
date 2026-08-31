const fs = require('fs');
const path = 'src/components/PusatInformasiView.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetButtons = `              <button onClick={() => handleOpenMedia('Agenda Salafiyah Ulya 2026/2027', '/agenda_SA.jpeg', <Calendar className="w-5 h-5 text-indigo-500" />, 'image')} className="w-full text-left pl-12 pr-4 py-3 hover:bg-slate-100 text-slate-700 border-b border-slate-200/50 text-sm font-semibold flex items-center">
                <Calendar className="w-4 h-4 mr-3 text-indigo-500" /> Agenda Salafiyah Ulya 2026/2027
              </button>
              <button onClick={() => handleOpenMedia('Agenda Salafiyah Wustho 2026/2027', '/agenda_SW.jpeg', <Calendar className="w-5 h-5 text-emerald-500" />, 'image')} className="w-full text-left pl-12 pr-4 py-3 hover:bg-slate-100 text-slate-700 border-b border-slate-200/50 text-sm font-semibold flex items-center">
                <Calendar className="w-4 h-4 mr-3 text-emerald-500" /> Agenda Salafiyah Wustho 2026/2027
              </button>\n`;

// Remove from openJadwal
content = content.replace(targetButtons, '');

// Add to openAgenda
const agendaRegex = /(<FileText className="w-5 h-5 mr-3 text-teal-500" \/> Agenda Terbaru[\s\S]*?\{openAgenda && \([\s\S]*?<div className="bg-slate-50 flex flex-col w-full pb-2">)/m;

content = content.replace(agendaRegex, "$1\n" + targetButtons);

fs.writeFileSync(path, content, 'utf8');
console.log('done');
