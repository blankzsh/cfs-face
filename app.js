const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Natural sort comparison function for filenames with numbers
function naturalSort(a, b) {
  const aParts = a.split(/(\d+)/).filter(Boolean);
  const bParts = b.split(/(\d+)/).filter(Boolean);
  
  for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
    // If both parts are numeric
    if (!isNaN(aParts[i]) && !isNaN(bParts[i])) {
      const numA = parseInt(aParts[i], 10);
      const numB = parseInt(bParts[i], 10);
      if (numA !== numB) {
        return numA - numB;
      }
    } 
    // If only one part is numeric or parts are strings
    else if (aParts[i] !== bParts[i]) {
      return aParts[i].localeCompare(bParts[i]);
    }
  }
  
  // If all compared parts are equal, the shorter string comes first
  return aParts.length - bParts.length;
}

// Get all images from PlayerPhotos folder
function getImages() {
  const photosDir = path.join(__dirname, 'PlayerPhotos');
  try {
    const files = fs.readdirSync(photosDir)
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      });
    
    return files.map(file => {
      return {
        filename: file,
        path: `/photos/${file}`
      };
    });
  } catch (err) {
    console.error('Error reading photos directory:', err);
    return [];
  }
}

// Serve static images from PlayerPhotos folder
app.use('/photos', express.static(path.join(__dirname, 'PlayerPhotos')));

// Main route
app.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 100;
  const search = req.query.search || '';
  const sortOrder = req.query.sort || 'natural-asc';
  
  let images = getImages();
  
  // Apply search filter if search term is provided
  if (search) {
    images = images.filter(img => 
      img.filename.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Apply sorting
  images.sort((a, b) => {
    if (sortOrder === 'natural-asc') {
      return naturalSort(a.filename, b.filename);
    } else if (sortOrder === 'natural-desc') {
      return naturalSort(b.filename, a.filename);
    } else if (sortOrder === 'filename-asc') {
      return a.filename.localeCompare(b.filename);
    } else if (sortOrder === 'filename-desc') {
      return b.filename.localeCompare(a.filename);
    }
    return 0;
  });
  
  // Update order after sorting - this assigns the dynamic "#序号" based on current sort order
  images = images.map((img, index) => {
    return {
      ...img,
      order: index + 1
    };
  });
  
  // Calculate pagination
  const totalImages = images.length;
  const totalPages = Math.ceil(totalImages / perPage);
  const startIndex = (page - 1) * perPage;
  const paginatedImages = images.slice(startIndex, startIndex + perPage);
  
  // Prepare next page images for preloading
  const nextPageImages = page < totalPages 
    ? images.slice(startIndex + perPage, startIndex + (perPage * 2)) 
    : [];
  
  res.render('index', {
    images: paginatedImages,
    nextPageImages,
    currentPage: page,
    totalPages,
    search,
    sortOrder
  });
});

app.listen(port, () => {
  console.log(`Player photos gallery app listening at http://localhost:${port}`);
});

