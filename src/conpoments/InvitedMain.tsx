import { TextField, Typography, Box, Button } from "@mui/material";
import Cookies from 'js-cookie';
import { useState } from "react";

function InvitedMain () {
    
    const [nameValue, setNameValue] = useState<string>('')

    const handleValueChanged = (e: React.ChangeEvent<HTMLInputElement>)=> {
        setNameValue(e.target.value)
    }

    const handleSubmit = (e: React.FormEvent)=>{
        
        e.preventDefault()

        if (nameValue) {
            Cookies.set('invited', nameValue, { expires: 7 })
            alert(`ようこそ！🤗　${nameValue}さま！`)
            location.reload()
        } else {
            alert('入力したお名前を確認してください。')
        }
    }

    return (
        <>
            <Box
                component="form"
                noValidate
                autoComplete="off"
                width={"300px"}
                onSubmit={handleSubmit}
            >
                <Typography
                    variant="h4"
                    style={{ 
                        marginBottom: '30px',
                        textAlign: 'center'
                    }}
                >
                    🥩🥩🥩🥩🥩🥩🥩🥩<br/>
                    ようこそ！<br/>
                    肉パーティーへ<br/>
                    🥩🥩🥩🥩🥩🥩🥩🥩
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "flex-end"
                    }}
                >
                    <TextField 
                        id="standard-basic"
                        label="お名前を入力してください。"
                        fullWidth
                        variant="standard"
                        onChange={handleValueChanged}
                    />
                    <Button 
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={ {
                            maxHeight: '32px',
                        }}
                    >
                        参加
                    </Button>
                </Box>
                <Typography
                    variant="caption"
                    width='100%'
                    style={{
                        opacity: '0.3',
                        fontSize: '9px',
                        
                    }}
                >
                    このパーティーは年齢が２０歳以下の人は参加できません。
                </Typography>   
            </Box>
            
        </>
    );
}

export default InvitedMain;