import * as React from "react";
import { Col, Row, Button, Form, Input, Typography, Grid, Checkbox } from "antd";

import SocialLogin from "../components/socialLogin";
import Background_login from "../public/images/background_login";

import "../styles/login.less";
import "../styles/animations.less";

const { useBreakpoint } = Grid;
const { Title, Link } = Typography;

export interface LoginPreProps {}

const LoginPre: React.SFC<LoginPreProps> = () => {
        const breakPoint = useBreakpoint();

        return (
                <Row className="content__container fadeIn" justify={breakPoint.xs ? "center" : "space-around"} align="middle">
                        <Col className="login__col" xs={0} lg={18} xl={18}>
                                <Background_login />
                        </Col>

                        <Col className="login__col" xs={18} lg={6} xl={6}>
                                <Form className="login__form">
                                        <Title level={2}>Login</Title>

                                        <label htmlFor="username">Username</label>
                                        <Form.Item name="username">
                                                <Input />
                                        </Form.Item>

                                        <label htmlFor="username">Username</label>
                                        <Form.Item name="password">
                                                <Input.Password />
                                        </Form.Item>

                                        <Form.Item name="remember" valuePropName="checked">
                                                <Row align="middle">
                                                        <Col span={12}>
                                                                <Checkbox>Remember me</Checkbox>
                                                        </Col>

                                                        <Col span={12} style={{ textAlign: "right" }}>
                                                                <Link href="/register">Forgot Password?</Link>
                                                        </Col>
                                                </Row>
                                        </Form.Item>

                                        <Form.Item>
                                                <Button type="primary" htmlType="submit" size="middle">
                                                        Login
                                                </Button>
                                        </Form.Item>
                                </Form>

                                <Title level={4}>Other login methods</Title>
                                <SocialLogin list={["facebook", "google", "github"]} />
                        </Col>
                </Row>
        );
};

export default LoginPre;
