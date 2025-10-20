import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css                   */const l=[{id:"sphere-landing",category:"threejs",title:"Sphere - 3D Landing Page",description:"Interactive 3D sphere rendered in Three.js. Users can view and manipulate the sphere in the browser.",stack:["Three.js","JavaScript","HTML","CSS"],media:{type:"image",src:"assets/gifs/sphere.gif",alt:"Animated Three.js sphere demo"},links:[{label:"GitHub",url:"https://github.com/hachemawawi/3d-sphere-landingpage",variant:"primary"}],demoUrl:"https://github.com/hachemawawi/3d-sphere-landingpage"},{id:"virtual-try-on",category:"markerbased",title:"Virtual Try-On",description:"Virtual try-on experience powered by Three.js and MindAR that lets users preview outfits in augmented reality.",stack:["Three.js","MindAR.js","TensorFlow.js"],media:{type:"image",src:"assets/gifs/tryOn.gif",alt:"Virtual try-on WebAR experience"},links:[{label:"GitHub",url:"https://github.com/hachemawawi/Virtual-Try-On",variant:"primary"},{label:"Try WebAR",url:"https://hachemawawi.me/Virtual-Try-On/",variant:"success"}],demoUrl:"https://hachemawawi.me/Virtual-Try-On/"},{id:"virtual-classroom",category:"threejs",title:"Virtual Classroom",description:"Immersive virtual classroom walkthrough showcasing the future of interactive teaching environments.",stack:["Next.js","React Three Fiber","Tailwind CSS"],media:{type:"image",src:"assets/gifs/vrClass.gif",alt:"Virtual classroom experience"},links:[{label:"GitHub",url:"https://github.com/hachemawawi/vrclass-ai-teacher",variant:"primary"}],demoUrl:"https://github.com/hachemawawi/vrclass-ai-teacher"},{id:"gaming-chair",category:"markerless",title:"Place The Gaming Chair",description:"World-tracked AR placement demo that anchors a gaming chair into real-world environments using WebXR.",stack:["A-Frame","Three.js","WebXR"],media:{type:"image",src:"assets/gifs/placeFurniture.gif",alt:"Gaming chair placed in AR"},links:[{label:"Try WebAR",url:"https://h-hitt.glitch.me/",variant:"success"}],demoUrl:"https://h-hitt.glitch.me/"},{id:"business-card",category:"markerbased",title:"Business Card WebAR",description:"AR-enhanced business card featuring a custom talking avatar that reacts to user interactions.",stack:["Three.js","AR.js","A-Frame","Blender"],media:{type:"iframe",src:"https://www.youtube.com/embed/Ufx6JM2NE4w?si=43wZaacLCgZDJHyz",title:"Business Card WebAR demo"},links:[{label:"Try WebAR",url:"https://oneplus-bc.glitch.me/",variant:"success"}],demoUrl:"https://oneplus-bc.glitch.me/"},{id:"saudi-day",category:"markerbased",title:"Saudi National Day Face Filter",description:"Cross-platform AR face filter with capture and record functionality to celebrate Saudi National Day.",stack:["Three.js","MindAR.js","TensorFlow.js"],media:{type:"iframe",src:"https://www.youtube.com/embed/ZOswetGYt7I?si=8w6Af3flSZPrXZ-U",title:"Saudi National Day face filter demo"},links:[{label:"Try WebAR",url:"https://fullmask.glitch.me/",variant:"success"}],demoUrl:"https://fullmask.glitch.me/"},{id:"avatar-clone",category:"markerbased",title:"Avatar Clone Shooting Fire",description:"Marker-based AR experience where a custom avatar clone launches fire effects in real time.",stack:["Three.js","A-Frame","JavaScript","AR.js","Blender"],media:{type:"iframe",src:"https://www.youtube.com/embed/dCo52lJyF2Q?si=-Ih7KgrIAB9whSWC",title:"Avatar Clone WebAR demo"},links:[{label:"Try WebAR",url:"https://h-clone.glitch.me/",variant:"success"}],demoUrl:"https://h-clone.glitch.me/"}],r=document.getElementById("projectsGrid"),i=document.getElementById("projectFilter"),o=e=>e.media.type==="iframe"?`
            <div class="ratio ratio-16x9 project-card-media">
                <iframe src="${e.media.src}" title="${e.media.title}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
            </div>
        `:`
        <a class="project-card-media d-block overflow-hidden" href="${e.demoUrl||(e.links[0]?e.links[0].url:"#")}" target="_blank" rel="noopener">
            <img class="card-img-top project-card-image" src="${e.media.src}" alt="${e.media.alt}" loading="lazy">
        </a>
    `,d=e=>!e||!e.length?"":e.map(a=>`
            <a class="btn btn-outline-${a.variant} btn-sm" href="${a.url}" target="_blank" rel="noopener">
                ${a.label}
            </a>
        `).join(""),n=(e="all")=>{if(!r)return;const a=e==="all"?l:l.filter(t=>t.category===e);if(!a.length){r.innerHTML=`
            <div class="col-12">
                <div class="alert alert-warning" role="status">No projects available for this category just yet. Check back soon!</div>
            </div>
        `,r.dataset.count="0";return}r.innerHTML=a.map(t=>`
            <div class="col-12 col-md-6 col-lg-4 project-col" data-category="${t.category}">
                <article class="card h-100 border-0 shadow-sm project-card">
                    ${o(t)}
                    <div class="card-body d-flex flex-column">
                        <span class="badge bg-primary mb-3 text-uppercase small">${t.category.replace(/-/g," ")}</span>
                        <h3 class="card-title h5">${t.title}</h3>
                        <p class="text-muted card-text">${t.description}</p>
                        <div class="d-flex flex-wrap gap-2 mb-3">
                            ${t.stack.map(s=>`<span class="badge bg-light text-dark border">${s}</span>`).join("")}
                        </div>
                        <div class="mt-auto d-flex flex-wrap gap-2">
                            ${d(t.links)}
                        </div>
                    </div>
                </article>
            </div>
        `).join(""),r.dataset.count=String(a.length)},m=()=>{if(document.getElementById("projects-jsonld"))return;const e={"@context":"https://schema.org","@type":"ItemList",name:"WebAR Portfolio Projects",description:"A curated list of WebAR and immersive web projects built by Hachem Awawi.",itemListElement:l.map((t,s)=>({"@type":"CreativeWork",position:s+1,name:t.title,url:t.demoUrl||t.links[0]?.url||"",description:t.description,keywords:t.stack.join(", "),inLanguage:"en"}))},a=document.createElement("script");a.type="application/ld+json",a.id="projects-jsonld",a.textContent=JSON.stringify(e),document.head.appendChild(a)},c=e=>{n(e)};r&&(n(i?i.value:"all"),m());i&&i.addEventListener("change",e=>{c(e.target.value)});window.filterProjects=c;
