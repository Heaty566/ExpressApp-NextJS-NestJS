import * as React from "react";
import { Layout, Menu, Row, Col } from "antd";
import "../styles/navbar.less";

const AppLogoLarge = require("../public/icons/express_logo-large.svg");
const { Header } = Layout;
export interface NavBarProps {}
const NavBar: React.SFC<NavBarProps> = () => {
        return (
                <Header className="navbar__container">
                        <Row>
                                <Col sm={12}>
                                        <Row justify="start">
                                                <a className="navbar__logo" href="/home">
                                                        <AppLogoLarge className="icon" />
                                                </a>
                                        </Row>
                                </Col>
                                <Col xs={0} sm={12}>
                                        <Row justify="end">
                                                <Menu mode="horizontal" theme="dark">
                                                        <Menu.Item>
                                                                <a href="/login">Login</a>
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                                <a href="/register">Register</a>
                                                        </Menu.Item>
                                                </Menu>
                                        </Row>
                                </Col>
                        </Row>
                </Header>
        );
};

export default NavBar;
