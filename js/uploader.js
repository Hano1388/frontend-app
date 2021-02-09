// https://mounirmesselmeni.github.io/2012/11/20/reading-csv-file-with-javascript-and-html5-file-api/

// handleFiles is a method that makes sure the browser supports file reader before we continue
function handleFiles(files) {
	// Check for the various File API support.
	if (window.FileReader) {
		// FileReader are supported.
    console.log("files: ", files);
		getAsText(files[0]);
	} else {
		alert('FileReader are not supported in this browser.');
	}
}

function getAsText(fileToRead) {
	var reader = new FileReader();
	// Handle errors load
	reader.onload = loadHandler;
	reader.onerror = errorHandler;
	// Read file into memory as UTF-8
	reader.readAsText(fileToRead);
}

function loadHandler(event) {
	var csv = event.target.result;
  // process.js
	processData(csv);
}

function errorHandler(event) {
	if(event.target.error.name == "NotReadableError") {
		alert("Canno't read file !");
	}
}
