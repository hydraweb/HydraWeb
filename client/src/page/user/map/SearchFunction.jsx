import styles from './HydraMap.module.scss';
import styled from "@emotion/styled/macro";
import { useTranslation, Trans } from "react-i18next";
import { green } from '@material-ui/core/TextField';
import TextField from '@material-ui/core/TextField';
import { GeoJsonLayer } from '@deck.gl/layers';
import React, { useEffect, useState, useRef } from 'react';
import {
  alpha,
  ThemeProvider,
  withStyles,
  makeStyles,
  createTheme,
} from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import { zoomIn } from './LayerV2'
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExploreIcon from '@material-ui/icons/Explore';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import InputBase from "@material-ui/core/InputBase";
import Pagination from "@material-ui/lab/Pagination";


const Accordion = withStyles({
    root: {
      backgroundColor: '#024FA1',
      boxShadow: 'none',
      '&:not(:last-child)': {
        borderBottom: 0,
      },
      '&:before': {
        display: 'none',
      },
      '&$expanded': {
        margin: 'auto',
      },
    },
    expanded: {},
  })(MuiAccordion);
  
  const AccordionSummary = withStyles({
    root: {
      backgroundColor: '#024FA1',
      borderBottom: '1px solid rgba(0, 0, 0, .125)',
      marginBottom: -1,
      minHeight: 15,
      '&$expanded': {
        minHeight: 15,
      },
    },
    content: {
      '&$expanded': {
        margin: '12px 0',
      },
    },
    expanded: {},
  })(MuiAccordionSummary);
  
  const AccordionDetails = withStyles((theme) => ({
    root: {
      padding: 0,
    },
  }))(MuiAccordionDetails);
  

//搜尋功能用到的函式
export default function SearchResult({data, zoomTo, allData, setAllData, layers, setLayers, setHoverInfo, setClickInfo, zoomInData}){
    var title = []
    //點擊按鈕時觸發的函式
    function btnClicked() {
      zoomIn(allData, setAllData, layers, setLayers, setHoverInfo, setClickInfo, data.geometry, zoomInData)
      zoomTo(data.geometry)
    }
    //顯示圖層資訊
    const xyCord = Object.entries(data.geometry).map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        const list2 = Object.entries(value).map(([key2, value2]) => {
          let tempKey = 'X Coordinate'
          if (key2 === '1') {
            tempKey = 'Y Coordinate'
          }
          return (
            <div>{tempKey} : {value2.toString()}</div>
          )
        })
        if (key === "coordinates") {
          return (
            <div>
              <div>{list2}</div>
            </div>
          )
        }
        else{
          return (
            <div>
              <h5>{key}:</h5>
              <div>{list2}</div>
            </div>
          )
        }
      } else {
        return (
          <div>{key} : {value.toString()}</div>
        );
      
      }
    })
    const list = Object.entries(data.properties).map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
          const list2 = Object.entries(value).map(([key2, value2]) => {
          return (
              <div>{key2} : {value2.toString()}</div>
          )
          })
          return (
          <div>
              <h5>{key}:</h5>
              <div>{list2}</div>
          </div>
          )
      } else {
          return (
          <div>{key} : {value.toString()}</div>
          );
      }
    })
    for (var i in data.properties) {
      if (i.indexOf("prop") >= 0) {
          if (title.length === 0) {
          title.push(data.properties["prop1"]["檔名"])
          break
          }
      }
      else {
          if (i === "measurement") {
          title.push(data.properties[i])
          break
          }
      }
    }
    return (
    <div>
        <Accordion>
        <AccordionSummary aria-controls="panel1d-content1" id="panel1d-header1" expandIcon={<ExpandMoreIcon />}>
              <div className={styles.search_div}>
                <Button variant="contained"  onClick={btnClicked}>
                  查看
                </Button>
                <Typography className="ml-3" >{title}</Typography>
              </div>
            </AccordionSummary>
        <AccordionDetails>
            <div className={styles.circle_analysis_result_container}>
                <div className={styles.circle_analysis_result_wrapper1}>
                <> {xyCord}</>
                </div>
                <div className={styles.circle_analysis_result_wrapper1}>
                <> {list}</>
                </div>
            </div>
        </AccordionDetails>
        </Accordion>
    </div>
    )
  }