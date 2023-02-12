import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import { React, useState } from 'react'

const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [confirmpassword, setconfirmpassword] = useState();
    
    const handleClick = () => setShow(!show);
    const submitHandler = () => {};
    const setPassword = () => {};

    return(
        <VStack spacing="5px" color="black">

            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder="Enter Your Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Enter Your Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>


            <Button
                colorScheme="green"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
            >
                Login
            </Button>

            <Button
                variant="solid"
                colorScheme="red"
                // bgColor="#4A756E"
                width="100%"
                onClick={() => {
                    setEmail("guest@example.com");
                    setPassword("123456");
                }}
            >
                Get guest user credentials!
            </Button>
        </VStack>
    )
}

export default Login