import vtkFullScreenRenderWindow from 'https://unpkg.com/@kitware/vtk.js@29.0.0/Rendering/Misc/FullScreenRenderWindow.js';
import vtkActor from 'https://unpkg.com/@kitware/vtk.js@29.0.0/Rendering/Core/Actor.js';
import vtkMapper from 'https://unpkg.com/@kitware/vtk.js@29.0.0/Rendering/Core/Mapper.js';
import vtkSphereSource from 'https://unpkg.com/@kitware/vtk.js@29.0.0/Filters/Sources/SphereSource.js';
// To load other formats, you would import specific readers, e.g.:
// import vtkSTLReader from 'https://unpkg.com/@kitware/vtk.js@29.0.0/IO/Geometry/STLReader.js';
// import vtkOBJReader from 'https://unpkg.com/@kitware/vtk.js@29.0.0/IO/Geometry/OBJReader.js';


const container = document.querySelector('#vtk-container');
const fullScreenRenderWindow = vtkFullScreenRenderWindow.newInstance({
    root: container,
});
const renderer = fullScreenRenderWindow.getRenderer();
const renderWindow = fullScreenRenderWindow.getRenderWindow();

// ----------------------------------------------------------------------------
// Minimal VTK.js example: Displaying a sphere
// Replace this with actual human body model loading
// ----------------------------------------------------------------------------

// 1. Create a sphere source
const sphereSource = vtkSphereSource.newInstance();
sphereSource.setRadius(1.0); // Adjust size as needed

// 2. Create a mapper
const mapper = vtkMapper.newInstance();
mapper.setInputConnection(sphereSource.getOutputPort());

// 3. Create an actor
const actor = vtkActor.newInstance();
actor.setMapper(mapper);

// Set color (e.g., a skin tone or anatomical color)
actor.getProperty().setColor(1.0, 0.8, 0.7); // Light skin tone (R, G, B)

// Add the actor to the renderer
renderer.addActor(actor);

// ----------------------------------------------------------------------------
// How to load a 3D model (e.g., STL, OBJ, VTK formats):
// You would typically fetch a 3D model file and pass its content to a reader.
// Example for STL:
/*
fetch('path/to/your/model.stl')
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => {
        const stlReader = vtkSTLReader.newInstance();
        stlReader.parseAsArrayBuffer(arrayBuffer);
        // Connect the reader to a mapper and actor
        const modelMapper = vtkMapper.newInstance();
        modelMapper.setInputConnection(stlReader.getOutputPort());
        const modelActor = vtkActor.newInstance();
        modelActor.setMapper(modelMapper);
        modelActor.getProperty().setColor(0.7, 0.7, 0.7); // Example color
        renderer.addActor(modelActor);
        renderer.resetCamera();
        renderWindow.render();
    })
    .catch(error => {
        console.error('Error loading STL model:', error);
    });
*/
// ----------------------------------------------------------------------------


// Reset camera to view the sphere
renderer.resetCamera();
renderWindow.render();

// Log to console for user guidance
console.log(
    "VTK.js human body visualization initialized with a placeholder sphere.\n" +
    "To display an actual 3D human body model, you will need to:\n" +
    "1. Obtain a 3D model file (e.g., in .stl, .obj, .vtp format) that is publicly accessible.\n" +
    "2. Uncomment and adapt the 'How to load a 3D model' section in this file (`body_visualization.js`)" +
    "   using the appropriate VTK.js reader (e.g., vtkSTLReader, vtkOBJReader, vtkXMLPolyDataReader).\n" +
    "3. Replace the placeholder sphere creation with your model loading logic."
);
