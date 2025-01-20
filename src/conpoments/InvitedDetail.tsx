import { Button, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import FireworkCanvas from './FireworkCanvas'
import Cookies from "js-cookie";

type invitedInfo = {
    invitedName : string,
}

function InvitedDetail (props: invitedInfo) {

    const colors = ['#F44062', '#46CBF4', '#060728', '#5EC24F', '#62C1FF'];

    const handleValueChanged = () => {
        Cookies.set('invited', '', { expires: -1 })
        location.reload()
    }

    return (
        <>
            <FireworkCanvas />
            <Typography
                variant="body1"
                style={{
                    textAlign: "center",
                    position: 'relative',
                    zIndex: 0,
                }}
            >
                <Typography 
                    variant="h5"
                    style={{
                        fontWeight: "bold",
                        color: colors[Math.round(colors.length * Math.random())]
                    }}
                >
                    {props.invitedName}様、
                </Typography>
                招待に応じてくださって<br/>
                ありがとうございます。🙇‍♂️<br/><br/>

                日程：令和7年一月二十五日<br/>
                時間：17時から<br/>
                場所：まだ決めています。

            </Typography>
            <Button
                size="small"
                startIcon={<DeleteIcon />}
                style={{
                    display: "flex",
                    alignItems: "center",
                    position: 'relative',
                    zIndex: 0,
                }}
                onClick={handleValueChanged}
            >이름 초기화</Button>
        </>
    );
}

export default InvitedDetail;