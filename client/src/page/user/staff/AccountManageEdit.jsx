import {Breadcrumb, Button, Form, Table} from "react-bootstrap";
import React, {Suspense, useContext, useEffect, useState} from "react";
import {accountInfoUser, accountSendEdit} from "../../../lib/api";
import Cookies from 'js-cookie'
import {userContext} from "../../../provider/UserProvider";
import {Link, Route, Switch, useHistory, useLocation, useParams} from "react-router-dom";
import styled from "@emotion/styled";
import {StyledTable, StyledTd, StyledTh, Title} from "./Staff";
import Pagination from "@material-ui/lab/Pagination";
import useQuery from "../../../lib/hook";
import styles from "../User.module.scss";
import {useToasts} from "react-toast-notifications";
import { useTranslation, Trans } from "react-i18next";

export default function AnnouncementEdit() {
    const { t, i18n } = useTranslation()
    let query = useQuery();
    let history = useHistory()
    const { addToast } = useToasts();

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [id, setId] = useState("")
    const [phone, setPhone] = useState("")
    const [avatar, setAvatar] = useState("")
    const [password, setPassword] = useState("")

    const submitForm = (e) => {
        let id =  query.get("id")
        accountSendEdit({
                username:username,
                phone:phone,
                password:password,
                avatar:avatar
            },id
        ).then((res) => {
            addToast('修改成功.', { appearance: 'success',autoDismiss:true });
        }).catch((err) => {

        }).finally(() => {

        })
    }

    useEffect(() => {
        if (typeof query.get("id")!=='undefined' && query.get("id") != null) {
            let id =  query.get("id")
            accountInfoUser({},id)
            .then((res) => {
                setUsername(res.data.username)
                setEmail(res.data.email)
                setId(res.data.id)
                setPhone(res.data.Phone)
                setAvatar(res.data.avatar)
            }).catch((err) => {
    
            }).finally(() => {
    
            })
        } else {
            
        }
    }, [])

    return (
        <div>
            <Title>{t('user_profile')}</Title>
            <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>{t('name')}</Form.Label>
                    <Form.Control type="text" placeholder="" value={username} onChange={(e)=>setUsername(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>{t('phone')}</Form.Label>
                    <Form.Control type="text" placeholder="" value={phone} onChange={(e)=>setPhone(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>password</Form.Label>
                    <Form.Control type="text" placeholder="" value={password} onChange={(e)=>setPassword(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>avatar</Form.Label>
                    <Form.Control type="text" placeholder="" value={avatar} onChange={(e)=>setAvatar(e.target.value)} />
                </Form.Group>
            </Form>
            <Button variant="primary" onClick={(e)=>submitForm(e)}>{t('confirm')}</Button>
        </div>
    )
}