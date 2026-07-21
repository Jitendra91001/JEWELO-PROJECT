import { Col, Row, } from 'antd'
import React, { useEffect } from 'react'
import CardBox from '../elements/card/CardBox';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/Theme/Theme.context';
import CustomButton from '../elements/Button/CustomButton';
import { useNavigate } from 'react-router-dom';
import { pathConstants } from '../../constant';
import { useAppDispatch } from '../../hooks/redux-hooks';
import { getWardAdminCardData } from '../../redux/wardRoomChange/thunk';
import CardBox2 from '../elements/card/CardBox2';

interface DashBoardCardsProps {
    viewReport?: boolean;
    cardData?: any;
    query?: any;
    newRegistration?: boolean;
    loader?: boolean;
    CardBoxTow?: boolean;
    handleClick ? : any;
}

const DashBoardCards = ({ viewReport = false, newRegistration = false, cardData, query = null, loader = false,CardBoxTow=false  }: DashBoardCardsProps) => {

    const navigate = useNavigate()
    const { Color } = useTheme()
    const { t } = useTranslation()
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(query){
            dispatch(getWardAdminCardData(query))
        }
    }, [])

    return (
        <Row align={"middle"} justify={"space-between"} className=' pl-[6px] mb-5' >
            <Row gutter={[12, 12]} className='ml-0'>
                { 
              CardBoxTow ?
                     cardData.length>0 && cardData?.map((res) => (
                        <Col style={{ padding: "0px 6px 0px 0px" }}>
                            <CardBox2
                                isLoading={loader}
                                items={{
                                    key: res?.id,
                                    avatar: res?.avatar,
                                    title: res?.title,
                                    description: res?.description,
                                    bottomText: res?.bottomText
                                }}
                                onClick={res?.handleClick ? res?.handleClick : ( res?.navigation ? () => navigate(`${res.navigation}`) : () => (null))}
                                key={res?.description}
                                sx={(res?.navigation || res?.handleClick )? { cursor: "pointer", } : { cursor: "default" }}
                            />
                        </Col>
                    ))
                    : cardData.length>0 && cardData?.map((res) => (
                        <Col style={{ padding: "0px 6px 0px 0px" }}>
                            <CardBox
                                isLoading={loader}
                                items={{
                                    key: res?.id,
                                    avatar: res?.avatar,
                                    title: res?.title,
                                    description: res?.description,
                                    bottomText: res?.bottomText
                                }}
                                onClick={res?.navigation ? () => navigate(`${res.navigation}`) : () => (null)}
                                key={res?.description}
                                sx={res?.navigation ? { cursor: "pointer", } : { cursor: "default" }}
                            />
                        </Col>
                    ))
                }
            </Row>
            {
                viewReport && (
                    <Col>
                        <Row wrap={true} className='flex justify-end mt-4'>
                            <CustomButton
                                type={"default"}
                                value={t("View Report")}
                                className={"mr-8"}
                                onClick={() => navigate(pathConstants.patientReports)}
                            />
                        </Row>
                    </Col>
                )
            }
            {
                newRegistration && (
                    <Col>
                        <Row wrap={true} className='flex justify-end mt-4'>
                            <CustomButton
                                value={t("newRegistration")}
                                className={"mr-8"}
                                sizeType={"large"}
                                onClick={() => navigate(pathConstants.opdPatientRegistration)}
                            />
                        </Row>
                    </Col>
                )
            }
        </Row>
    )
}

export default DashBoardCards