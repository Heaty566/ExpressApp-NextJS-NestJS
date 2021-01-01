import * as React from "react";

export interface HelloProps {
        hello: string;
}

const Hello: React.SFC<HelloProps> = () => {
        return <h1>test</h1>;
};

export default Hello;

// const IndexPage = () => {
//         return (
//                 <div>
//                         <p>tessadsatsssssssss</p>
//                 </div>
//         );
// };

// export default IndexPage;
