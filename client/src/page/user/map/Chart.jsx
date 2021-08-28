import styles from './Chart.module.scss'
import styled from "@emotion/styled/macro";
import { useTranslation, Trans } from "react-i18next";
import React, { useEffect, useState, useRef } from 'react';
import { Toolbox } from "@nebula.gl/editor";
import DeckGL from "deck.gl";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as d3 from 'd3';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import { blue } from '@material-ui/core/colors';

const useStyles1 = makeStyles((theme) => ({
  root: {
    maxWidth: "100%"
  },
}));

function LineChart({ chartData }) {

  const [info, setInfo] = useState(null)

  useEffect(() => {
    drawChart();
  }, [chartData]);


  function drawChart() {
    let d = chartData
    // set the dimensions and margins of the graph

    const list = []
    Object.entries(chartData).map(([key, value]) => {
      if (typeof value === 'object' && value !== null && key != "prop1") {
        list.push(value)
      } else if (key == "prop1") {
        setInfo(value)
      }
    })

    岩類一(list)
  }


  function 岩類一(list) {
    const margin = { top: 0, right: 0, bottom: 0, left: 0 },
      width = 400 - margin.left - margin.right,
      height = 1000 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#岩類一_container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    let maxdept = list[list.length - 1].下限深度
    let mindept = list[0].上限深度
    let alldept = maxdept - mindept
    let calc = height / alldept

    var colorize3 = d3.scaleOrdinal().range(d3.schemePaired)

    svg.append("text")
      .style("fill", "white")
      .attr('y', 20)
      .attr('x', 0)
      .text("深度")

    svg.append("text")
      .style("fill", "white")
      .attr('y', 20)
      .attr('x', 105)
      .text("岩類一")

    svg.append("text")
      .style("fill", "white")
      .attr('y', 20)
      .attr('x', 215)
      .text("岩類二")

    //上限 axis
    svg.selectAll("text.depth")
      .data(list).enter().append("text")
      .attr("class", "depth")
      .attr('y', (d) => {
        return ((d.上限深度) * calc) + 15 + 50
      })
      .attr('x', 0)
      .attr("fill", "white")
      .attr("width", 100)
      .text((d, i) => d.上限深度)

    //下限 axis
    svg.append("text")
      .data([list[list.length - 1]])
      .style("fill", "white")
      .attr('y', height)
      .attr('x', 0)
      .text((d, i) => d.下限深度)

    svg.selectAll('rect.rock1')
      .data(list).enter().append("rect")
      .attr('y', (d) => {
        return d.上限深度 * calc + 50
      })
      .attr('x', 100)
      .attr("height", (d) => {
        return (d.下限深度 - d.上限深度) * calc
      })
      .attr("width", 100)
      .attr('stroke', 'black')
      .attr('fill', (d, i) => colorize3(d.岩類一));

    svg.selectAll("text.rock1")
      .data(list)
      .enter()
      .append("text")
      .attr("class", "hour")
      .attr('y', (d) => {
        return d.上限深度 * calc + 20 + 50
      })
      .attr('x', 105)
      .attr("fill", "white")
      .text((d, i) => d.岩類一)

    svg.selectAll('rect.rock2')
      .data(list).enter().append("rect")
      .attr('y', (d) => {
        return d.上限深度 * calc + 50
      })
      .attr('x', 210)
      .attr("height", (d) => {
        return (d.下限深度 - d.上限深度) * calc
      })
      .attr("width", 100)
      .attr('stroke', 'black')
      .attr('fill', (d, i) => colorize3(d.岩類二));


    svg.selectAll("text.rock2")
      .data(list)
      .enter()
      .append("text")
      .attr("class", "rock2")
      .attr('y', (d) => {
        return d.上限深度 * calc + 20 + 50
      })
      .attr('x', 215)
      .attr("fill", "white")
      /* .attr("style", "font-family: arial; fill: white; writing-mode: tb") */
      .text((d, i) => d.岩類二)



  }


  return (
    <div className={styles.chart_container}>
      <div id="岩類一_container" className={styles.chart_container} />
    </div>
  );
}

export default function Chart({ showChart, setShowChart, chartData }) {

  const handleClickOpen = () => {
    setShowChart(true);
  };

  const handleClose = (value) => {
    setShowChart(false);
  };

  return (
    <div>
      <Dialog maxWidth="false" onClose={handleClose} open={showChart}>
        <DialogTitle >地質鑽探資料</DialogTitle>
        <LineChart chartData={chartData} />
      </Dialog>
    </div>
  );
}

