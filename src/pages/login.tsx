import React, { useState } from "react";
import { Form, useActionData } from "react-router-dom";

const Login = () => {
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false)

    const actionData = useActionData()
    console.log('actionData==', actionData)

    return <div>
        <h1>Login page</h1>
        <h1>登录页</h1>
        {
            actionData?.code === 200 ? <div>{actionData?.messga}-{actionData.data.username}</div> :

                <Form method="post">
                    <label>
                        Username: <input name="username" />
                    </label>{' '}
                    <button type="submit" disabled={isLoggingIn}>
                        {isLoggingIn ? 'Logging in...' : 'Login'}
                    </button>
                </Form>
        }


    </div>
}

export default Login