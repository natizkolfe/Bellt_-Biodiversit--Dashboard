
const filepath = "data/samples.json";


function init(id) {
    var selecter1 = d3.select("#selDataset")
    d3.json(filepath).then((data)=> { 
        var names = data.names;
        names.forEach((id) => {
            selecter1.append("option").text(id).property("value", id)
        });
        var blorp = names[0];
            makePanel(blorp);
            makeChart(blorp);       
    });
}

function optionChanged(blorp) {
    makePanel(blorp);
    makeChart(blorp);
}

function makePanel(item) {
    var selecter2 = d3.select("#sample-metadata");
    d3.json(filepath).then((data) => {
        var metadata = data.metadata;
        var result1 = metadata.filter(items => items.id == item);
        var demographics = result1[0];
        selecter2.html("");
        Object.entries(demographics).forEach(([key, value]) => {
            selecter2.append("p").text(`${key}: ${value}`);
        });
    });
}

function makeChart(item) {
    var selecter3 = d3.select("#bar");
    d3.json(filepath).then((data) => {
        var samples = data.samples;
        var result2 = samples.filter(items => items.id == item);
        var dataset = result2[0];
        var ids = dataset.otu_ids;
        var labels = dataset.otu_labels;
        var values = dataset.sample_values;
        var barData = [
            {
                x: values.slice(0, 10).reverse(),
                y: ids.slice(0, 10).map(object => `OTU ${object}`).reverse(),
                hovertext: labels.slice(0, 10).reverse(),
                hoverinfo: "hovertext",
                type: "bar",
                orientation: "h"
            }
        ];
        var barLayout = {
            title: "Top 10 OTUs per Test Subject",
            automargin: true
        };
        Plotly.newPlot("bar", barData, barLayout);
        var bubbleData = [
            {
                x: ids,
                y: values,
                text: labels,
                mode: "markers",
                marker: {
                    color: ids,
                    size: values
                }

            }
        ];
        var bubbleLayout = {
            margin: {
                t: 0
            },
            xaxis: {
                title: "OTU ID"
            },
            yaxis: {
                title: "Frequency"
            },
            hovermode: "closest"
        };
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
}

init();