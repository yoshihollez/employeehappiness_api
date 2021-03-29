import { FormControl, FormLabel, Input, FormErrorMessage, Button, Box } from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import React from 'react'
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';


// export default class Register extends React.Component {
//   constructor(props) {
//     super(props);

//   }

//   render() {
//     return (
//             <Wrapper variant="small">
//                 <Formik initialValues={{username:"",password:""}}
//             onSubmit={(values)=>{
//                 console.log(values)
//             }}
//             >
//                 {({isSubmitting})=>(
//                 <Form>
//                     <InputField name="username" placeholder="username" label="Username"></InputField>
//                     <Box mt="4">  
//                         <InputField name="password" placeholder="password" label="Password" type="password"></InputField>
//                     </Box>
//                     <Button mt="4" type="submit" colorScheme="teal" isLoading={isSubmitting}>register</Button>
//                 </Form>
//             )}
//     </Formik>
//             </Wrapper>
//     );
//   }
// }


interface registerProps {

}

export const Register: React.FC<registerProps> = ({}) => {
    return (
            <Wrapper variant="small">
                <Formik initialValues={{username:"",password:""}}
            onSubmit={(values)=>{
                console.log(values)
            }}
            >
                {({isSubmitting})=>(
                <Form>
                    <InputField name="username" placeholder="username" label="Username"></InputField>
                    <Box mt="4">  
                        <InputField name="password" placeholder="password" label="Password" type="password"></InputField>
                    </Box>
                    <Button mt="4" type="submit" colorScheme="teal" isLoading={isSubmitting}>register</Button>
                </Form>
            )}
    </Formik>
            </Wrapper>
    );
}

export default Register