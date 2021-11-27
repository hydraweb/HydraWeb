import { Breadcrumb, Button, Form, Table, Modal } from "react-bootstrap";
import React, {Suspense, useContext, useEffect, useState} from "react";
import {userForgotPasswdCheckToken, userProfile, userSignUp} from "../../../lib/api";
import {accountInfoUser,accountSendEdit } from "../../../lib/api";
import Cookies from 'js-cookie'
import {userContext} from "../../../provider/UserProvider";
import {Link, Route, Switch, useHistory, useLocation} from "react-router-dom";
import styled from "@emotion/styled";
import {useToasts} from "react-toast-notifications";
import { useTranslation, Trans } from "react-i18next";
import useQuery from "../../../lib/hook";
import styles from "./Profile.module.scss"

export default function UserData() {
    const { t, i18n } = useTranslation()
    let defaultData = {
        userid: "",
        username: "",
        email: "",
        avatar: "",
        phone: "",
    }

    let query = useQuery();
    let history = useHistory()
    const location = useLocation()
    const {user, setUser} = useContext(userContext)
    const [isLoading, setLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [data, setData] = useState(defaultData)
    const { addToast } = useToasts();
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [id, setId] = useState("")
    const [phone, setPhone] = useState("")
    const [avatar, setAvatar] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {
        userProfile().then((res) => {
            setIsLoaded(true)
            console.log(res.data)
            setData(res.data.data.user)
            setId(res.data.data.user.userid)
            setPhone(res.data.data.user.phone)
            setUsername(res.data.data.user.username)
        }).catch((err) => {
            setIsError(true)
        }).finally(() => {
            setLoading(false)
        })
        
    }, [])

    const submitForm = (e) => {
        let id = data.userid
        console.log(id)
        accountSendEdit({
            username: username,
            phone: phone,
            password: password,
            avatar: 1
        }, id
        ).then((res) => {
            addToast('修改成功.', { appearance: 'success', autoDismiss: true });
        }).catch((err) => {
            addToast('修改失敗.', { appearance: 'error', autoDismiss: true });
        }).finally(() => {

        })
    }

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item active>{t('user_profile')}</Breadcrumb.Item>
            </Breadcrumb>
            <p className={styles.page_title}>{t('user_profile')}</p>
            <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>{t('name')}</Form.Label>
                    <Form.Control type="text" placeholder="" value={username} onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>{t('phone')}</Form.Label>
                    <Form.Control type="text" placeholder="" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>{t('password')}</Form.Label>
                    <Form.Control type="text" placeholder="" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
            </Form>
            <Button variant="primary" onClick={(e) => submitForm(e)}>{t('confirm')}</Button>
            
        </div>
    )
}