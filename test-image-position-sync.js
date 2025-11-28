// Test function to verify image position synchronization
// Run this in the browser console to check if all views are using the same data

function testImagePositionSync(linkIndex) {
    console.log('=== TESTING IMAGE POSITION SYNC ===');
    console.log('Link Index:', linkIndex);
    
    if (linkIndex < 0 || linkIndex >= links.length) {
        console.error('Invalid link index');
        return;
    }
    
    const link = links[linkIndex];
    console.log('Link data from array:', {
        imagePosition: link.imagePosition,
        imageScale: link.imageScale,
        x: link.imagePosition?.x,
        y: link.imagePosition?.y
    });
    
    // Check editor modal
    const modalImg = document.getElementById(`modal-preview-img-${linkIndex}`);
    if (modalImg) {
        const modalTransform = window.getComputedStyle(modalImg).transform;
        console.log('Editor modal transform:', modalTransform);
    } else {
        console.log('Editor modal not found');
    }
    
    // Check links list
    const listImg = document.querySelector(`[data-index="${linkIndex}"] .link-image-container img`);
    if (listImg) {
        const listTransform = window.getComputedStyle(listImg).transform;
        console.log('Links list transform:', listTransform);
    } else {
        console.log('Links list image not found');
    }
    
    // Check live preview
    const previewImgs = document.querySelectorAll('#preview-links .preview-link-image img');
    if (previewImgs[linkIndex]) {
        const previewTransform = window.getComputedStyle(previewImgs[linkIndex]).transform;
        console.log('Live preview transform:', previewTransform);
    } else {
        console.log('Live preview image not found at index', linkIndex);
    }
    
    // Calculate expected transform
    const expectedTransform = calculateLinkImageTransform(link);
    console.log('Expected transform (from calculateLinkImageTransform):', expectedTransform);
}

// Usage: testImagePositionSync(0) // Replace 0 with the link index you want to test


