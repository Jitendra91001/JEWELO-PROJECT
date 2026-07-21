// CERT-In F-12 — idle / inactivity session-timeout enforcement.
//
// Mounted once inside MainLayout so it lives on every authenticated route
// and is absent on /login. Reads `isLogedIn` from Redux to know whether to
// arm the timer. On timeout, runs the same teardown the explicit Sign Out
// button uses: clear Redux auth, wipe sessionStorage, purge redux-persist,
// hard-redirect to /login.

import React from "react";
import { Modal, Button } from "antd";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux-hooks";
import { logout } from "../../../redux/auth/slice";
import { persistor } from "../../../redux/store";
import { useIdleTimeout } from "../../../hooks/useIdleTimeout";

// HIPAA "automatic logoff" guidance + SP 800-53 AC-11 ("Session Lock")
// commonly land on 15 minutes idle. 60-second warning grace gives the
// user time to react without keeping the session alive on a forgotten
// workstation.
const IDLE_AFTER_MS = 15 * 60 * 1000;
const WARNING_DURATION_MS = 60 * 1000;

const IdleTimeout: React.FC = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const isLogedIn = useAppSelector((s) => s.authReducer.isLogedIn);

    const handleTimeout = () => {
        dispatch(logout());
        sessionStorage.clear();
        persistor.purge();
        window.location.href = "/login";
    };

    const { isWarning, secondsRemaining, stayLoggedIn } = useIdleTimeout({
        enabled: isLogedIn,
        idleAfterMs: IDLE_AFTER_MS,
        warningDurationMs: WARNING_DURATION_MS,
        onTimeout: handleTimeout,
    });

    return (
        <Modal
            open={isWarning}
            title={t("idleTimeoutTitle")}
            closable={false}
            maskClosable={false}
            keyboard={false}
            centered
            footer={[
                <Button key="logout" onClick={handleTimeout}>
                    {t("logOutNow")}
                </Button>,
                <Button key="stay" type="primary" onClick={stayLoggedIn}>
                    {t("stayLoggedIn")}
                </Button>,
            ]}
        >
            <p>
                {t("idleTimeoutBody")}{" "}
                <strong>{secondsRemaining}</strong>{" "}
                {t("idleTimeoutSeconds")}.
            </p>
        </Modal>
    );
};

export default IdleTimeout;
