import styled from "@emotion/styled/macro";
import NormalButton from "../../../component/NormalButton";
import styles from './HydraMap.module.scss';
import LinearProgress from '@material-ui/core/LinearProgress';
import { UploadFile, DownloadFileList, DownloadFile, DownloadBufferFile } from '../../../lib/api'
import React, { useEffect, useState, useRef } from 'react';
import Slider from '@material-ui/core/Slider';
import { useTranslation, Trans } from "react-i18next";
import { useToasts } from "react-toast-notifications";
import TooltipMaterial from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Cookies from 'js-cookie' 
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import axios from "axios";

const Accordion = withStyles({
  root: {
    backgroundColor: '#457ee7aa',
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
    backgroundColor: '#457ee7aa',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 20,
    '&$expanded': {
      minHeight: 20,
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


const InputWrapper = styled.div(
  props => (
    {
      width: "100%",
      borderWidth: "2x",
      borderColor: "white",
      borderBottom: "1px",
      borderBottomStyle: "solid",
      borderRadius: "0px",
      display: 'flex',
      backgroundColor: props.backgroundColor ? "#6465688e" : "#6465688e",
      alignItems: 'flex-start',
      flexFlow: '1',
      paddingTop: '0px',
      paddingBottom: '0px',
      paddingLeft: "0px",
      paddingRight: "5px",

    }
  )
)

const StyledLabel = styled.label(
  props => (
    {
      padding: "8px 10px 0px 10px",
      marginBottom: 0
    }
  )
)


export default function UploadFIle() {

  const { t, i18n } = useTranslation();
  const [fileType, setFileType] = useState()
  const { addToast } = useToasts();
  const [uploadFile, setUploadFile] = useState()
	const [isShow, setIsShow] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dataLoadState, setDataLoadState] = useState(0)
  const [downloadFileList, setDownloadFileList] = useState([])
  const [jsonFileArray, setJsonFileArray] = useState([])
  const [shpFileArray, setShpFileArray] = useState([])
  const [xlsxFileArray, setXlsxFileArray] = useState([])
  const [csvFileArray, setCsvFileArray] = useState([])
  const [crdFileArray, setCrdFileArray] = useState([])

  //將所有後端回傳的資料根據格式分割
  function splitDownloadFileList(data) {
    let jsonarr = []
    let shparr = []
    let xlsxarr = []
    let csvarr = []
    let crdarr=[]
    for(let i = 0; i<data.length;i++){
      if(data[i][0].endsWith('xlsx')){
        xlsxarr.push(data[i])
      }
      else if(data[i][0].endsWith('shp')){
        shparr.push(data[i])
      }
      else if(data[i][0].endsWith('json')){
        jsonarr.push(data[i])
      }
      else if(data[i][0].endsWith('csv')){
        csvarr.push(data[i])
      }
      else{
        crdarr.push(data[i])
      }
    }
    setJsonFileArray(jsonarr)
    setShpFileArray(shparr)
    setXlsxFileArray(xlsxarr)
    setCsvFileArray(csvarr)
    setCrdFileArray(crdarr)
  }

  //輸入檔案改變時觸發
  const uploadOnChange = (e) => {
    setDataLoadState(0)
    setProgress(0)
    if(e.target.files.length !== 0){
      let tempArr = []
      for (let i = 0;i<e.target.files.length; i++){
        tempArr.push(e.target.files[i])
      }
      setUploadFile(tempArr)
      let ft = e.target.files[0].name
      if(ft.endsWith('.json')){
        setFileType("json")
      }
      else if(ft.endsWith('.csv')){
        setFileType("csv")
      }
      else if(ft.endsWith('.xlsx')){
        setFileType("xlsx")
      }
      else if(ft.endsWith('.shp')){
        setFileType("shapefile")
      }
      else if(ft.endsWith('.shx')){
        setFileType("shapefile")
      }
      else if(ft.endsWith('.dbf')){
        setFileType("shapefile")
      }
      else if(ft.endsWith('.prj')){
        setFileType("shapefile")
      }
      else if(ft.endsWith('.CRD')){
        setFileType("CRD")
      }
      else{
        setFileType("unknow")
      }
    }
  }
  //點擊上傳按鈕時觸發
  const onFileUploadClick = (value) => {
    setDataLoadState(1)
    setProgress(0)
    let formData = new FormData();
    for (let i = 0; i< uploadFile.length; i++){
      formData.append("file", uploadFile[i])
    }
    var htmllink = ""
    if(value === 'original'){
      htmllink = 'http://140.121.196.77:30180/api/v1/user/uploadFile/original'
    }
    else if (value === 'json'){
      htmllink = 'http://140.121.196.77:30180/api/v1/user/uploadFile/convertJSON'
    }
    else if (value === 'csv'){
      htmllink = 'http://140.121.196.77:30180/api/v1/user/uploadFile/convertCSV'
    }
    else if (value === 'xlsv'){
      htmllink = 'http://140.121.196.77:30180/api/v1/user/uploadFile/convertXLSX'
    }
    else if (value === 'geojson'){
      htmllink = 'http://140.121.196.77:30180/api/v1/user/uploadFile/convertGEOJSON'
    }
    else if (value === 'shp'){
      htmllink = 'http://140.121.196.77:30180/api/v1/user/uploadFile/convertSHP'
    }
    axios({
      withCredentials: true,
      method: "post",
      url: htmllink,
      headers: { 
        "Content-Type": "multipart/form-data",
        'Authorization': `Bearer ${Cookies.get('access')}`
      },
      data: formData,
      onUploadProgress: (p) => {
        setProgress(Math.round(p.loaded * 100 / p.total))
      }
    }).then((res) => {
      addToast(t('Upload_success'), { appearance: 'success', autoDismiss: true });
      DownloadFileList().then((res) => {
        splitDownloadFileList(res.data.data)
        setDownloadFileList(res.data.data)
      }).catch((err) => {
      }).finally(() => {
      })
    }).catch((err) => {
      addToast(t('Upload_fail'), { appearance: 'error', autoDismiss: true });
    }).finally(() => {
    })
  }
  //根據輸入的檔案格式顯示按鈕
  function ShowButton(){
    if(fileType === "json"){
      return (
        <div className={styles.function_wrapper_upload}>
          <Button className="mt-2" type="submit" onClick={() => onFileUploadClick("original")}>
            {t('upload')}
          </Button>
          <Button className="mt-2" type="submit" onClick={() => onFileUploadClick("csv")}>
            {t('convert_to_csv_and_upload')}
          </Button>
          <Button className="mt-2" type="submit" onClick={() => onFileUploadClick("shp")}>
            {t('convert_to_shapefile_and_upload')}
          </Button>
        </div>
      )
    }
      else if(fileType === "csv"){
        return (
          <div className={styles.function_wrapper_upload}>
            <Button type="submit" onClick={() => onFileUploadClick("original")}>
              {t('upload')}
            </Button>
            <Button className="mt-2" type="submit" onClick={() => onFileUploadClick("json")}>
              {t('convert_to_json_and_upload')}
            </Button>
            <Button className="mt-2" type="submit" onClick={() => onFileUploadClick("geojson")}>
              {t('convert_to_geojson_and_upload')}
            </Button>
          </div>
        )
      }
      else if(fileType === "xlsx"){
        return (
          <div className={styles.function_wrapper_upload}>
            <Button type="submit" onClick={() => onFileUploadClick("original")}>
              {t('upload')}
            </Button>
            <Button className="mt-2" type="submit" onClick={() => onFileUploadClick("json")}>
              {t('convert_to_json_and_upload')}
            </Button>
            <Button className="mt-2" type="submit" onClick={() => onFileUploadClick("geojson")}>
              {t('convert_to_geojson_and_upload')}
            </Button>
          </div>
        )
      }
      else if(fileType === "shapefile"){
        return (
          <div className={styles.function_wrapper_upload}>
            <Button type="submit" onClick={() => onFileUploadClick("original")}>
              {t('upload')}
            </Button>
            <Button className="mt-2" type="submit" onClick={() => onFileUploadClick("geojson")}>
              {t('convert_to_geojson_and_upload')}
            </Button>
          </div>
        )
      }
      else if(fileType === "CRD"){
        return (
          <div className={styles.function_wrapper_upload}>
            <Button type="submit" onClick={() => onFileUploadClick("original")}>
              {t('upload')}
            </Button>
            <Button className="mt-2" type="submit" onClick={() => onFileUploadClick("geojson")}>
              {t('convert_to_geojson_and_upload')}
            </Button>
          </div>
        )
      }
      else{
        return (
          <div></div>
        )
      }
  }

  //下載檔案
  const downloadFile = ({ data, fileName, fileType }) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType })
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  }
  //點擊下載按鈕時觸發
  const downloadOnClick = (val) => {
    if(val.endsWith('xlsx')){
      DownloadBufferFile({
        data:val
      }).then((res) => {
        downloadFile({data: res.data, fileName:val, fileType:res.headers['content-type']})
      })
    }
    else if(val.endsWith('shp')){
      let filename = val.replace("shp", "zip")
      DownloadBufferFile({
        data:val
      }).then((res) => {
        downloadFile({data: res.data, fileName: filename, fileType: res.headers['content-type']})
      })
    }
    else{
      DownloadFile({
        data:val
      }).then((res) => {
        if(res.headers['content-type'] === 'application/json'){
          downloadFile({data: JSON.stringify(res.data, null, 2), fileName:val, fileType:res.headers['content-type']})
        }
        /* else if(res.headers['content-type'] === 'application/x-zip-compressed'){
          var blob = new Blob([str2bytes(res.data)], {type: "application/zip"});
          const a = document.createElement('a')
          a.download = "test.zip"
          a.href = window.URL.createObjectURL(blob)
          const clickEvt = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
          })
          a.dispatchEvent(clickEvt)
          a.remove()
        } */
        else{
          downloadFile({data: res.data, fileName:val, fileType:res.headers['content-type']})
        }
      }).catch((err) => {
      }).finally(() => {
      })
    }
  }

  let BtnList = [["JSON",jsonFileArray], ["CSV",csvFileArray], ["XLSX",xlsxFileArray], ["SHP",shpFileArray], ["CRD",crdFileArray]].map((data) =>
    <div>
      <Accordion square defaultExpanded>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon />}>
          <Typography>{data[0]}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.flex_column}>
            {
              data[1].map((d, index) =>
                <div className={styles.search_tag_text}>
                  {d[0]} 下載次數:{d[1]}
                  <Button onClick={() => downloadOnClick(d[0])}>{t('download')}</Button>
                </div>
              )
            }
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
  //初始化時執行，之後就不再執行
  useEffect(() => {   
    DownloadFileList().then((res) => {
      splitDownloadFileList(res.data.data)
      setDownloadFileList(res.data.data)
    }).catch((err) => {
    }).finally(() => {
    })
  },[]);

  return (
    <div>
      <h4 className={styles.func_title}>{t('Upload_file')}</h4>
      <form enctype="multipart/form-data" method="POST" action="">
        <input type="file" onChange={uploadOnChange} multiple/>
      </form>
            <div>
                <ShowButton/>
            </div>
      <div className={styles.loading}>
        {dataLoadState === 1 &&
          <LinearProgress variant="determinate" value={progress} />
        }
      </div>
      <h4 className={styles.func_title}>{t('download_file')}</h4>
      <div>
        {BtnList}
      </div>
    </div>
  )

}