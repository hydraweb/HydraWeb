import {Form} from "react-bootstrap";
import React, {Suspense, useContext, useState} from "react";
import {userSignUp} from "../../../lib/api";
import Cookies from 'js-cookie'
import {userContext} from "../../../provider/UserProvider";
import {Link, Route, Switch, useHistory, useLocation} from "react-router-dom";
import styled from "@emotion/styled";
import { useTranslation, Trans } from "react-i18next";
import Button from '@material-ui/core/Button';
//沒用到
export default function SystemSetting() {
    const { t, i18n } = useTranslation()
    let history = useHistory()
    const location = useLocation()
    const {user, setUser} = useContext(userContext)
    const [currentMode, setCurrentMode] = useState(1)   // 2 = 系統更新

    

    return (
        <div>
            <p>hi</p>
        </div>
    )
}