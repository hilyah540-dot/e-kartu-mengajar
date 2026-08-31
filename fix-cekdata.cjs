const fs = require('fs');

let content = fs.readFileSync('src/components/CekDataView.tsx', 'utf8');

// Undo the previous bad replacement
content = content.replace(
  '    </div>\n      {editingRow && (\n        <EditDataModal\n          row={editingRow}\n          teacherName={teacherName}\n          onClose={() => setEditingRow(null)}\n          onSave={handleSaveEdit}\n        />\n      )}\n  );\n}',
  '      {editingRow && (\n        <EditDataModal\n          row={editingRow}\n          teacherName={teacherName}\n          onClose={() => setEditingRow(null)}\n          onSave={handleSaveEdit}\n        />\n      )}\n    </div>\n  );\n}'
);

fs.writeFileSync('src/components/CekDataView.tsx', content);

console.log('Fixed CekDataView.tsx');
