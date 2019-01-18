module.exports.renderHTML = renderHTML;

function renderHTML(sections, title) {
    
    try {
        
        var html = '<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"><title>' + title + '</title><link rel="stylesheet" href="url/style.css"></head><body><div class="container">';
            
        for(let i=0; i < sections.length; i++) {
            html += renderSection(sections[i]);
        }
    
        html += '</div><br><br><br></body></html>';
      
        return html;
    }
    catch(error) {
        console.error(error);
        return '';
    }
}


function renderSection(section) {
    
      switch(section.type) {
            case 'Header-Block':
                return renderHeaderSection(section);
            case 'Text-Block':
                return renderTextSection(section);
            case 'Text-Bild-Block':
                return renderPictureSection(section);
            case 'Text-Video-Block':
                return renderVideoSection(section);
      }

}


function renderHeaderSection(section) {
  return '<h1 class="my-4">' + section.header + '</h1>'+'<p style="font-size:18px">' + section.content  +'</p>';
}

function renderTextSection(section) {
    var header = '<br><hr><br><div class="row"><div class="col-md-7"><h3>' + section.header + '</h3>';
    var content = '<p>' + section.content + '</p></div></div>';
  return header+content;
}

function renderPictureSection(section) {
    var header = '<br><hr><br><div class="row"><div class="col-md-7"><h3>' + section.header + '</h3>';
    var content = '<p>' + section.content + '</p></div>';
    var asset = '<div class="col-md-5"><img class="img-fluid rounded mb-3 mb-md-0" src="' + section.assetURL + '" alt=""></div></div>';
    return header+content+asset;
}

function renderVideoSection(section) {
    var header = '<br><hr><br><div class="row"><div class="col-md-7"><h3>' + section.header + '</h3>';
    var content = '<p>' + section.content + '</p></div>';
    var asset = '<div class="col-md-5"><div class="embed-responsive embed-responsive-21by9 rounded img-fluid mb-3 mb-md-0"><iframe class="embed-responsive-item" src="' + section.assetURL + '"></iframe></div></div></div>';
    return header+content+asset;
}
