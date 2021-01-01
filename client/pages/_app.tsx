import * as React from "react";
import "antd/dist/antd.css";
import "../styles/base.less";
import Navbar from "../container/Navbar";
import { Layout } from "antd";
import Foot from "../container/Foot";
const { Content } = Layout;

export interface MyAppProps {
        Component: React.SFC;
        pageProps: any;
}

const MyApp: React.SFC<MyAppProps> = ({ Component, pageProps }) => {
        return (
                <Layout className="root">
                        <Navbar />
                        <Content className="container">
                                <Component {...pageProps} />
                        </Content>
                        <Foot />
                </Layout>
        );
};

export default MyApp;
