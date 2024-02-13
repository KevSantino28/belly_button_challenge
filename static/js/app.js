// Place url in a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// grab json data
d3.json(url).then(function(data) {
  console.log(data);
});

// Initialize the dashboard 
function init() {

    // grab the dropdown menu
    let dropDownMenu = d3.select("#selDataset");

    // populate the drop-down selector
    d3.json(url).then((data) => {
        
        let names = data.names;

        // Add  samples to dropdown menu
        names.forEach((id) => {

            // Log the value of id for each iteration of the loop
            console.log(id);

            dropDownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        // grabbing first sample
        let sample_one = names[0];

        console.log(sample_one);

        // Build the initial plots
        buildMetaData(sample_one);
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);
        buildGaugeChart(sample_one);

    });
};

// populating metadata info
function buildMetaData(sample){

    //grab data
    d3.json(url).then((data) =>{
        let metaData = data.metadata;

        //filtering based on sample
        let value = metaData.filter(result => result.id == sample);
        console.log(value)

        //grab first index
        let valueData = value[0];

        //clear out data
        d3.select("#sample-metadata").html("");

        //adding values to panel
        Object.entries(valueData).forEach(([key,value]) => {
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

// building barchart
function buildBarChart(sample){

    //grabbing data
    d3.json(url).then((data) =>{
        let sampleInfo = data.samples;

        //filtering data
        let value = sampleInfo.filter(result => result.id == sample);

        //grab first index
        let valueData = value[0];

        //grab all the values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        //log values
        console.log(otu_ids, otu_labels, sample_values);

        //display top 10
        let y = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let x = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();

        let trace = {
            x: x,
            y: y,
            text: labels,
            type: 'bar',
            orientation: 'h'
        };

        let layout = {
            title: 'Top 10 OTUs'
        };

        Plotly.newPlot('bar', [trace], layout)
    });
};

//building bubblechart
function buildBubbleChart(sample){

    //retrieve data
    d3.json(url).then((data) => {

        let sampleInfo = data.samples;

        //filter
        let value = sampleInfo.filter(result => result.id == sample);

        //first index
        let valueData = value[0];

        //grab values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        //log values
        console.log(otu_ids,otu_labels,sample_values);

        trace2 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Earth'
            }
        };

        //layout
        let layout = {
            hovermode: 'closest',
            xaxis: {title: 'OTU ID'},
        };

        //plot
        Plotly.newPlot("bubble",[trace2],layout)
    });
};

//creating function to change with sample
function optionChanged(value){
    console.log(value);

    buildMetaData(value);
    buildBarChart(value);
    buildBubbleChart(value);
};


// Call the initialize function
init();