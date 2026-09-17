import re

with open('src/components/MediaModal.tsx', 'r') as f:
    content = f.read()

handleShare_code = """  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: activeMediaModal?.title,
          url: activeMediaModal?.src
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      // Fallback
      window.open(activeMediaModal?.src, '_blank');
    }
  };

  if (!activeMediaModal) return null;"""

content = content.replace("  if (!activeMediaModal) return null;", handleShare_code)

with open('src/components/MediaModal.tsx', 'w') as f:
    f.write(content)
