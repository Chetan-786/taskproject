import Button from 'react-bootstrap/Button';
import React from "react";



export const Buttons = ({ children, onClick }) => {
    return (
        <Button onClick={onClick}>
            {children}
        </Button>
    )
}