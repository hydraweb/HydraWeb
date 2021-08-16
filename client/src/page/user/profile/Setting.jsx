import {Button, Form} from "react-bootstrap";
import React, {Suspense, useContext} from "react";
import {userSignUp} from "../../../lib/api";
import Cookies from 'js-cookie'
import {userContext} from "../../../provider/UserProvider";
import {Link, Route, Switch, useHistory, useLocation} from "react-router-dom";
import styled from "@emotion/styled";
import { useTranslation, Trans } from "react-i18next";

export default function Setting() {
    const { t, i18n } = useTranslation()
    let history = useHistory()
    const location = useLocation()
    const {user, setUser} = useContext(userContext)


    const Title = styled.span(
        props => ({
                marginRight: "10px",
            }
        ))
    return (
        <div>
            <p>{t('setting')}</p>
        </div>
    )
}