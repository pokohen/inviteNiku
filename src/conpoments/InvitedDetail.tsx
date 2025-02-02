import { Button, Link, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import FireworkCanvas from './FireworkCanvas'
import Cookies from "js-cookie";
import NaverMaps from "./NaverMaps";

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
            <Box
                component={"section"}
                sx={{
                    paddingTop: "80px",
                    paddingBottom: "40px",
                    width: '100%',
                    height: 'max-content',
                }}
            >
                <Typography
                variant="body1"
                style={{
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 0,
                }}
                >
                    <Typography
                    variant="h5"
                    style={{
                        fontWeight: 'bold',
                        color: colors[Math.round(colors.length * Math.random())],
                    }}
                    >
                        {props.invitedName}様、
                    </Typography>

                    招待に応じてくださって<br />
                    ありがとうございます。🙇‍♂️<br /><br />

                    日程：令和7年一月二十五日<br />
                    時間：19時から<br />
                    場所：パーティールーム・オンダム<br />
                    マップ：<Link href="https://naver.me/GMm8ttNp" underline='none' target="_blank">Naver Map</Link><br /><br />

                    飲み物や食べ物は自分で自由に持ってきてください。<br />
                    身分証明書などは必要ありません。<br /><br />

                    この場所は午後6時から午前7時までです。<br />
                    開始時刻は午後7時ですが、早く来たら先に入っても大丈夫です。<br /><br />

                    パスワードとかは下の担当者に連絡ください。<br />
                    ちなみに友達も呼んでも大丈夫ですが、金曜の午後17時までには必ず連絡ください。<br /><br />

                    このパーティーについてお問い合わせがある際は、<br />
                    以下の連絡先にお問い合わせください。<br /><br />
                    お楽しみに！🎉<br /><br />

                    連絡先：010-2649-7023<br />
                    担当：キム・ジンヒョン<br /><br />

                </Typography>
                <Box
                    component={'div'}
                    sx={{
                        width: "300px",
                        height: "300px",
                    }}
                > 
                    <NaverMaps latitude={37.487198183797} longitude={126.93040544686} />
                </Box>
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}    
                >
                    <Button
                        size="small"
                        startIcon={<DeleteIcon />}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            position: 'relative',
                            zIndex: 0,
                            textAlign: "center",
                            marginTop: "12px",
                        }}
                        onClick={handleValueChanged}
                    >名前再設定</Button>
                </Box>
            </Box>
        </>
    );
}

export default InvitedDetail;