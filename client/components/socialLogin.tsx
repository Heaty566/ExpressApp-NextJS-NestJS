import * as React from "react";
import axios from "axios";
import { Space } from "antd";
import { GoogleOutlined, FacebookOutlined, GithubOutlined } from "@ant-design/icons";

type socialType = "google" | "facebook" | "github";

export interface SocialLoginProps {
        list: socialType[];
}

const dataRender: {
        type: socialType;
        url: string;
        Component: React.SFC;
}[] = [
        { type: "google", url: `${process.env.SERVER_URL}/user/auth/google`, Component: () => <GoogleOutlined style={{ color: "#EA4335" }} /> },
        { type: "facebook", url: `${process.env.SERVER_URL}/user/auth/facebook`, Component: () => <FacebookOutlined style={{ color: "#3b5998" }} /> },
        { type: "github", url: `${process.env.SERVER_URL}/user/auth/github`, Component: () => <GithubOutlined style={{ color: "#24292e" }} /> },
];

const SocialLogin: React.SFC<SocialLoginProps> = ({ list = [] }) => {
        const filter = dataRender.filter((item) => list.includes(item.type));

        return (
                <Space size="large">
                        {filter.map(({ Component, type, url }) => (
                                <a key={type} href={url} style={{ fontSize: "32px" }}>
                                        <Component />
                                </a>
                        ))}
                </Space>
        );
};

export default SocialLogin;
