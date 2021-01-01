import * as React from "react";
import { Menu, Grid, Layout } from "antd";
import "../styles/foot.less";
const { useBreakpoint } = Grid;
const { Footer } = Layout;

export interface FootProps {}

const Foot: React.SFC<FootProps> = () => {
        const breakPoint = useBreakpoint();

        if (breakPoint.sm)
                return (
                        <Footer style={{ textAlign: "center", background: "#171717" }}>
                                <a style={{ color: "#fefefe" }} href="www.heaty566.io">
                                        Design By Heaty566
                                </a>
                        </Footer>
                );

        return (
                <footer className="foot">
                        <Menu mode="horizontal" theme="dark" style={{ background: "#171717" }} className="foot__menu">
                                <Menu.Item>
                                        <a href="/login">Login</a>
                                </Menu.Item>

                                <Menu.Item>
                                        <a href="/register">Register</a>
                                </Menu.Item>
                        </Menu>
                </footer>
        );
};

export default Foot;
