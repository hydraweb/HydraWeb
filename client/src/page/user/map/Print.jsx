import React, { useEffect, useState, useRef } from 'react';
import { useTranslation, Trans } from "react-i18next";
import {
 Button, Form
} from 'react-bootstrap';
import styled from "@emotion/styled/macro";
import { saveAs } from 'file-saver';
import styles from './HydraMap.module.scss';


const FormItem = styled.div(
  props => ({
    padding: "10px 10px 10px 0px",
  })
)

const FormItemContainer = styled.div(
  props => ({
    display: "flex",
    flexDirection: "row"
  })
)


export default function Print({ map, deck }) {
  const { t, i18n } = useTranslation();
  const [unit, setUnit] = useState("inch")
  const [format, setForamt] = useState("PNG")

  const onChangeUnit = (e) => {
    setUnit(e.target.value);
  }

  const onChangeFormat = (e) => {
    setForamt(e.target.value);
  }

  const downloadImage = () => {
    const fileName = "Map.png";

    const mapboxCanvas = map.current.getMap().getCanvas(
      document.querySelector(".mapboxgl-canvas")
    );
    deck.current.deck.redraw(true);
    const deckglCanvas = document.getElementById("deck-gl-canvas");

    let merge = document.createElement("canvas");
    merge.width = mapboxCanvas.width;
    merge.height = mapboxCanvas.height;

    var context = merge.getContext("2d");

    context.globalAlpha = 1.0;
    context.drawImage(mapboxCanvas, 0, 0);
    context.globalAlpha = 1.0;
    context.drawImage(deckglCanvas, 0, 0);

    merge.toBlob(blob => {
      saveAs(blob, fileName);
    });
  };

  const createPrintMap1 = () => {
    const html2canvas = require("html2canvas")

    let div = document.getElementsByClassName("mapboxgl-canvas")[0];
    deck.current.deck.redraw(true)
    html2canvas(div).then(canvas => {
      document.body.appendChild(canvas);
      deck.current.deck.redraw(true)
      let a = document.createElement('a');
      // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
      a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      a.download = 'screenshot.png';
      a.click();
    });

  }

  const createPrintMap2 = () => {
    const mapRef = map.current.getMap()
    mapRef.getCanvas().toBlob(function (blob) {
      saveAs(blob, 'map.png');
    });
  }

  const onBtnClick = () => {
    //downloadImage()
    //createPrintMap()
    createPrintMap2()
  }

  /*    const screenshot = () => {
        let canvas = $scope.scatterLayer.canvas;
          document.body.appendChild(canvas);
          let a = document.createElement('a');
          // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
          a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
          a.download = 'screenshot.png';
          a.click();
     } */


  return (
    <div>
      <h4 className={styles.func_title}>{t('print')}</h4>
      <Form>
        <FormItem>
          <h5>{t('unit')}</h5>
          <FormItemContainer>
            <Form.Check
              type={'radio'}
              label={t('inch')}
              id={`inch`}
              value={"inch"}
              checked={unit === "inch"}
              onChange={onChangeUnit}
            />
            <Form.Check
              className="ml-3"
              type={'radio'}
              label={t('meter')}
              id={`meter`}
              value={"meter"}
              checked={unit === "meter"}
              onChange={onChangeUnit}
            />
          </FormItemContainer>
        </FormItem>

        <FormItem>
          <h5>{t('output_format')}</h5>
          <FormItemContainer>
            <Form.Check
              type={'radio'}
              label={'PNG'}
              id={`PNG`}
              value={"PNG"}
              checked={format === "PNG"}
              onChange={onChangeFormat}
            />
            <Form.Check
              className="ml-3"
              type={'radio'}
              label={'PDF'}
              id={`PDF`}
              value={"PDF"}
              checked={format === "PDF"}
              onChange={onChangeFormat}
            />
          </FormItemContainer>
        </FormItem>


        <Button onClick={onBtnClick}>{t('print')}</Button>
      </Form>
    </div>
  )
}