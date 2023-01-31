function update_size(container, camera, renderer){
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
  }
  
  class Responsive {
    constructor(container, camera, renderer) {
     
      update_size(container, camera, renderer); // Set initial size
  
      window.addEventListener('resize', () => update_size(container, camera, renderer)) // if browser is resized, update the size of the container
    }
  }
  
  export { Responsive };


  