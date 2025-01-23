import { Button, Link, Typography } from '@mui/material';
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
                  時間：17時から<br />
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
            >名前再設定</Button>
        </>
    );
}

export default InvitedDetail;