import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name:string;
    label:string;
}
// _ is for unused vars
export const InputField: React.FC<InputFieldProps> = ({label,size:_,...props}) => {
    const [field,{error}] = useField(props);
        return (
            // !! converts to bool
                <FormControl isInvalid={!!error}>
                <FormLabel htmlFor="username">{label}</FormLabel>
                <Input {...field} {...props} id={field.name} placeholder="username" />
                {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
              </FormControl>
        );
} 