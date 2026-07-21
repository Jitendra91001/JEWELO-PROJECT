import { Typography } from 'antd'
import React from 'react'
import LatestModal from './LatestModal';
import { useTranslation } from 'react-i18next'

const ViewReasonModal = ({ showModal, reason }) => {

    const { t } = useTranslation();
    return (
        <LatestModal
            title={t("reason")}
            showModal={showModal}
            children={
                <>
                    <li>
                        <Typography.Text className='text-sm font-[400] !text-left block' style={{ color:'var(--fontColor)' }}>{reason}</Typography.Text>
                    </li>
                </>
            }
            okButtonProps={{ display: 'none' }}
            closable
            footer={false}
        />
    )
}

export default ViewReasonModal


