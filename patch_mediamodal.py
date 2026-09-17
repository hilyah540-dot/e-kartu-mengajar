import re

with open('src/components/MediaModal.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { ZoomIn, ZoomOut, X, Download } from 'lucide-react';",
                          "import { ZoomIn, ZoomOut, X, Download, Share2 } from 'lucide-react';")

with open('src/components/MediaModal.tsx', 'w') as f:
    f.write(content)
