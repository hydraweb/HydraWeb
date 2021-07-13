import {Button, Form, Table} from "react-bootstrap";
import React, {Suspense, useContext, useEffect, useState} from "react";
import {loginLog, systemLogGetAllYear, userSignUp} from "../../../lib/api";
import Cookies from 'js-cookie'
import {userContext} from "../../../provider/UserProvider";
import {Link, Route, Switch, useHistory, useLocation} from "react-router-dom";
import styled from "@emotion/styled";
import {DropdownButton, Dropdown} from 'react-bootstrap';
import styles from './LoginAnalytics.module.scss'
import Pagination from '@material-ui/lab/Pagination';

import { css, jsx } from '@emotion/react/macro'

const Title = styled.h1(
    props => ({
        fontSize: "20px",
        margin: "10px 10px 30px 0px",

    })
)


const FlexColumnContainer = styled.div(
    props => ({
        display: "flex",
    })
)

const StyledTh = styled.th(
    props => ({
        color:"white"
    })
)

const StyledTd = styled.td(
    props => ({
        color:"white"
    })
)

const StyledTable = styled.div(
    props => ({
        marginTop:"20px",
        marginBottom:"20px"
    })
)

function TableData({data}) {

    const idItems = data.map((d, index) =>
        <tr>
            <StyledTd>{d.id}</StyledTd>
            <StyledTd>{d.user.username}</StyledTd>
            <StyledTd>{d.created_at}</StyledTd>
        </tr>
    );

    return (
        <StyledTable>
            <Table striped bordered hover>
                <thead>
                <tr >
                    <StyledTh>id</StyledTh>
                    <StyledTh>username</StyledTh>
                    <StyledTh>登入時間</StyledTh>
                </tr>
                </thead>
                <tbody>
                {idItems}
                </tbody>
            </Table>
        </StyledTable>

    )
}

export default function LoginAnalytics() {
    let history = useHistory()
    const location = useLocation()
    const {user, setUser} = useContext(userContext)
    const [loading, setLoading] = useState(0)
    const [years, setYears] = useState([])
    const [page, setPage] = useState(1)
    const [totalpage, setTotalPage] = useState(0)


    const [currentSelectedYearIdx, setCurrentSelectedYearIdx] = useState(0)
    const onChangeYear = (index) => {
        setCurrentSelectedYearIdx(index)
    }
    const [currentSelectedMonthIdx, setCurrentSelectedMonthIdx] = useState(0)
    const onChangeMonth = (index) => {
        setCurrentSelectedMonthIdx(index)
    }

    const listItems = years.map((year, index) =>
        <Dropdown.Item key={year.toString()} onClick={(e) => onChangeYear(index)}
                       value={year}>{year.toString()}</Dropdown.Item>
    );

    const months = ["全年度", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const listItems2 = months.map((month, index) =>
        <Dropdown.Item key={month.toString()} onClick={(e) => onChangeMonth(index)}
                       value={month}>{month.toString()}</Dropdown.Item>
    );

    const [data, setData] = useState([])

    const loadData = () => {
        loginLog({
                params: {
                    page: page,
                    type: 'user_login',
                    year: years[currentSelectedYearIdx],
                    month: currentSelectedMonthIdx === 0 ? null : months[currentSelectedMonthIdx]
                }
            }
        ).then((res) => {
            setData(res.data.results)
            setTotalPage(res.data.count)
        }).catch((err) => {

        }).finally(() => {

        })
    }


    useEffect(() => {
        systemLogGetAllYear().then((res) => {
            setYears(res.data.data)
            setLoading(1)
        }).catch((err) => {
            setLoading(2)
        }).finally(() => {

        })
    }, [])

    return (
        <div>
            <Title>登入統計</Title>
            {loading == 0 &&
            <img
                className={styles.loading_image}
                src="/img/loading.svg"
            />
            }
            {loading == 1 &&
            <>
                <FlexColumnContainer>
                    <span className={styles.item1}>登入時間</span>
                    <DropdownButton className={styles.item2} id="years" title={years[currentSelectedYearIdx]}>
                        {listItems}
                    </DropdownButton>
                    <span className={styles.item2}>年</span>
                    <DropdownButton className={styles.item2} id="months" title={months[currentSelectedMonthIdx]}>
                        {listItems2}
                    </DropdownButton>
                    <span className={styles.item2}>月</span>
                    <Button onClick={(e) => {
                        setPage(1)
                        loadData()
                    }
                    } variant="outline-primary">查詢</Button>

                </FlexColumnContainer>
                <TableData data={data}/>
                <Pagination count={totalpage} page={page} variant="outlined" shape="rounded"
                            onChange={loadData}/>

            </>
            }
            {loading == 2

            }
        </div>
    )
}