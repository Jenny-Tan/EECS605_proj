import './App.css';
import React from 'react';

// atob is deprecated but this function converts base64string to text string
const decodeFileBase64 = (base64String) => {
  // From Bytestream to Percent-encoding to Original string
  return decodeURIComponent(
    atob(base64String).split("").map(function (c) {
      return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    }).join("")
  );
};


function App() {
  const [inputFileData, setInputFileData] = React.useState(''); // represented as bytes data (string)
  const [outputFileData, setOutputFileData] = React.useState(''); // represented as readable data (text string)
  const [buttonDisable, setButtonDisable] = React.useState(true);
  const [buttonText, setButtonText] = React.useState('Submit');

  // convert file to bytes data
  const convertFileToBytes = (inputFile) => {
    console.log('converting file to bytes...');
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(inputFile); // reads file as bytes data

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  // handle file input
  const handleChange = async (event) => {
    // Clear output text.
    setOutputFileData("");

    console.log('newly uploaded file');
    const inputFile = event.target.files[0];
    console.log(inputFile);
    
    //added by tyww to show the pictures
//     const reader = new FileReader();
//     reader.onload = function (e){
//                         $('#blah')
//                         .attr('src', e.target.result)
//                         .width(150)
//                         .height(200);
//     }
//     reader.readAsDataURL(event);
    //end tyww

    // convert file to bytes data
    const base64Data = await convertFileToBytes(inputFile);
    const base64DataArray = base64Data.split('base64,'); // need to get rid of 'data:image/png;base64,' at the beginning of encoded string
    const encodedString = base64DataArray[1];
    setInputFileData(encodedString);
    console.log('file converted successfully');

    // enable submit button
    setButtonDisable(false);
  }
  
  const loadFile = function(event) {
    const reader = new FileReader();
    reader.onload = function(){
      const output = document.getElementById('output');
      output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  };
 

  // handle file submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // temporarily disable submit button
    setButtonDisable(true);
    setButtonText('tyww Loading Result');

    // make POST request
    console.log('making POST request...');
    fetch('https://izm659ydfg.execute-api.us-east-1.amazonaws.com/prod/', {
      method: 'POST',
      headers: { "Content-Type": "application/json", "Accept": "text/plain" },
      body: JSON.stringify({ "image": inputFileData })
    }).then(response => response.json())
    .then(data => {
      console.log('getting response...')
      console.log(data);

      // POST request error
      if (data.statusCode === 400) {
        const outputErrorMessage = JSON.parse(data.errorMessage)['outputResultsData'];
        setOutputFileData(outputErrorMessage);
      }

      // POST request success
      else {
        const outputBytesData = JSON.parse(data.body)['outputResultsData'];
        setOutputFileData(decodeFileBase64(outputBytesData));
      }

      // re-enable submit button
      setButtonDisable(false);
      setButtonText('Submit');
    })
    .then(() => {
      console.log('POST request success');
    })
  }
  
          function show_list() {
            var courses = document.getElementById("courses_id");
  
            if (courses.style.display == "block") {
                courses.style.display = "none";
            } else {
                courses.style.display = "block";
            }
        }
        window.onclick = function (event) {
            if (!event.target.matches('.dropdown_button')) {
                document.getElementById('courses_id')
                    .style.display = "none";
            }
        }    

  return (
    <div className="App">
      <div className="Input">
        <h1>Input</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" accept=".png" onChange={handleChange} />
          <button type="submit" disabled={buttonDisable}>{buttonText}</button>
        </form>
      </div>
      <div className="Output">
        <h1>Results</h1>
        <p>{outputFileData}</p>
        <form>
          <input type="file" accept="image/*" onchange="loadFile(event)" />
          <img id="output" src="" width="100px" height="100px"/>
        </form>
      </div>

      <div class="dropdown_list">
            <button class="dropdown_button" 
                onclick="show_list()">
                Select course
            </button>
  
            <div id="courses_id" class="courses">
                <li><a href="">Machine learing</a></li>
                <li><a href="">Data science</a></li>
                <li><a href="">Data analysis</a></li>
                <li><a href="">Data mining</a></li>
                <li><a href="">Data warehousing</a></li>
            </div>
        </div>

<form>  
<b> Select your City from the list</b>  
<select id = "option" onchange = "dropdownMenu()" >  
<option> ---Choose City--- </option>  
<option> New York </option>  
<option> Amsterdam </option>  
<option> Paris </option>  
<option> London </option>  
</select>  
<p> Your selected city is:  
<input type = "text" id = "city" size = "20" </p>  
</form> 

    </div>
  );
}

export default App;
