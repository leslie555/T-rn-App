import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    ScrollView
} from 'react-native'
import { Header } from '../../../components'

class privacyPolicy extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {

        return (
            <View style={styles.serviceContainer}>
                <Header title={'隐私政策'} />
                <ScrollView>
                    <View style={styles.serviceBody} >
                        <Text>尊敬的用户，欢迎您注册成为弹窝的用户。</Text>
                        <Text>本最终用户许可使用协议（包括但不限于本协
                        议项下全部条款以及与本协议相关的通过平台发布
                        或未来可能修改、变更或发布的各项规则，以下简称
                        “本协议”）系成都弹个房科技有限公司（以下简称“本公
                        司”或“我们”）拟定并发布的，用于规范平台（即弹窝官方网
                        站 https://www.51tanwo.com/、弹窝官方客户端“弹窝Ap
                        p”、微信公众号，以及基于第三方网络平台运行的的网页程序
              ）注册用户（以下简称“用户”或“您”）在平台上注册以及使用平台服务的行为。</Text>
                        <Text>在您注册成为弹窝用户之前，请务必确认：您是具有完全民事权利能力及民事行为能力、有能力履行并承担本协议项下的权利及义务、并能够独立作为法律诉讼的一方，您已认真阅读本协议项下全部条款，特别是限制或免除我们责任的条款、对您的权利限制条款、争议解决和法律适用条款等，此类条款将以加粗的形式提示您注意。一旦您确认接受本协议，即表示您已经完全阅读、理解、同意接受并遵守本协议全部条款。</Text>
                        <Text>弹窝系由本公司研发运营管理，本公司对本协议享有修改及解释之权利。如本协议有任何修改变更，本公司将在弹窝官网（https://www.51tanwo.com/）及App刊载相关变更事项公告，并不再单独以其它方式通知您。所有修订的条款和规则一经公告立即生效，并对您产生法律约束力</Text>
                        <Text>如您对本协议或本协议修改变更的内容有异议，请您立即停止使用弹窝App并联系我们；如您继续使用我们的任何服务，则视为您已经同意并接受所有修改变更内容。</Text>
                        <Text>您点击页面下方的“我已阅读并同意《用户使用协议》”选项、或首次在手机App软件上点击“登录”选项取得账号或验证码，即视为您对本协议的签署；在任何情况下，您都不得以未签署纸质协议为由否认本协议各条款及效力。若因您对本协议的违反导致任何法律后果的发生，您应以自己的名义独立承担相应的全部责任</Text>
                        <Text>用户使用协议</Text>
                        <Text>一、注册账号</Text>
                        <Text>（一）您可通过手机号码或第三方平台账号注册并成为我们的用户。注册成功后，您将获得一个弹窝账号（下称“账号”）。您可在账号中设置和修改昵称、头像、性别、星座等，请您在进行上述操作时遵守法律法规和公序良俗，确保您不会因此侵害其他第三方的合法权益，否则我们有权要求您进行整改，并可能因此暂停向您提供服务；如您拒绝整改，我们有权对您的账号做封禁处理。</Text>
                        <Text>（二）您应确保注册账号的手机号均为您本人持有或经手机号持有人合法授权</Text>
                        <Text>二、个人信息保护</Text>
                        <Text>尊重和保护每一位弹窝用户的个人信息是我们的基本原则。我们将根据《隐私保护服务政策》之内容对您的个人信息进行保护，《隐私保护服务政策》属于本协议不可分割的一部分。在注册、使用弹窝App前，您承诺已经充分阅读、理解《隐私保护服务政策》的全部内容，同意并接受我们据此处理您的个人信息。</Text>
                        <Text>三、账号安全</Text>
                        <Text>（一）妥善保管账号</Text>
                        <Text>1、您的账号及提供的个人信息是您在弹窝的唯一识别信息。您注册成功后，请您严格履行对其的保密及保管，切勿将其转让、出售或授权给任何第三方使用。</Text>
                        <Text>2、请勿轻易将您的账号告知他人或与他人共用账号。若您主动告知他人您的账号或与他人共用账号，我们有权认为该账号的所有操作均代表您的本人意愿，并且由此产生的任何问题、不良后果（包括直接损失及间接损失）、法律责任均由您自行承担，我们不承担任何责任。</Text>
                        <Text>3、若您发现有第三人冒用、盗用您的账号，应立即通知我们停止您的账号服务，否则，由此产生的任何问题、不良后果（包括任何直接损失及间接损失）、法律责任均由您自行承担，我们不承担任何责任。此外，由于黑客行为或您的保管疏忽导致上述情形，我们将不会对此承担责任。由于我们对您的请求需要采取行动的合理时间，故在停止您的账号服务前，我们对第三人使用您的账号进行的操作所带来的损失不承担任何责任。</Text>
                        <Text>4、您在此承诺，您在登陆账号后，所从事的一切行为均代表您本人，并由您本人承担相应的法律后果。</Text>
                        <Text>（二）账号的修改、找回：</Text>
                        <Text>如您因更换用于注册账号的手机号码或第三方平台账号而需要修改账号，或您遗忘已注册的账号而需要找回账号，请严格按照我们的提示信息经过身份验证后操作，或者直接致电我们进行身份验证后，由我们为您修改或找回账号。</Text>
                        <Text>四、账号使用规范</Text>
                        <Text>（一）您在注册、使用平台服务的过程中，请您提供合法、真实、有效、准确并完整的资料（根据具体验证需要，可能包括身份证、户口本、护照、学历信息、联系方式、通讯地址、个人生物识别信息等）。为了将账号变动及时有效通知到您，以及更好保障您的账号安全，如该等资料发生变更，请您及时通知我们或在账号设置内操作变更。</Text>
                        <Text>（二）您同意并承诺在使用账号时，应当遵守中华人民共和国法律法规及各项政策，维护我们品牌形象，不会利用账号从事以下活动，或在使用账号过程中存在以下行为。否则，我们有权立即停止您账号的部分或全部使用权限，并有权追究您相应的法律责任（若有）：</Text>
                        <Text>1、上传、展示、发送、传播、散布或者以其他方式传送含有下列内容之一的信息，我们有权立即删除部分或全部该等信息：</Text>
                        <Text>（1）违反中华人民共和国法律法规及各项政策的非法信息，包括但不限于危害国家安全、泄露国家秘密、颠覆国家政权、破坏国家统一的信息；损害国家荣誉和利益的信息；煽动民族仇恨、民族歧视、破坏民族团结的信息；破坏宗教政策、宣扬邪教封建迷信的信息；散布谣言、扰乱社会秩序、破坏社会稳定的信息；危害国家或社会公共利益、涉及暴力、淫秽、色情、赌博、凶杀、恐怖、犯罪或教唆犯罪的信息；</Text>
                        <Text>（2）通过捏造、编造、臆想等方式虚构的不实信息；</Text>
                        <Text>（3）恶意诋毁、诽谤、中伤、恐吓、威胁、骚扰他人的信息，或粗俗、猥亵及其他道德上令人反感的内容或违反公序良俗的信息；</Text>
                        <Text>（4）侵犯他人名誉权、隐私权、知识产权、商业秘密的信息；</Text>
                        <Text>（5）恶意诋毁、诽谤、恐吓、中伤、威胁、骚扰弹窝官网管理员、本公司或其员工的信息；</Text>
                        <Text>（6）侵害我们品牌名誉、本公司商业秘密的信息；</Text>
                        <Text>（7）违反国家规定的政治宣传和/或新闻信息；不符合社会主义核心价值观的信息；</Text>
                        <Text>（8）妨碍互联网运行安全的信息</Text>
                        <Text>（9）其他中华人民共和国法律法规、规章、条例、政策、社会道德、公序良俗所禁止或限制的信息。</Text>
                        <Text>2、利用平台服务从事：</Text>
                        <Text>（1）未经允许，进入计算机信息网络或者使用计算机信息网络资源的；</Text>
                        <Text>（2）未经允许，对计算机信息网络功能进行删除、修改或者增加的；</Text>
                        <Text>（3）未经允许，对计算机信息网络中存储、处理或者传输的数据和应用程序进行删除、修改或者增加的；</Text>
                        <Text>（4）故意制作、传播计算机病毒等破坏性程序的；</Text>
                        <Text>（5）其他危害计算机信息网络安全的行为。</Text>
                        <Text>3、非法利用病毒、软件、程序等破坏、侵害我们系统，干扰我们的正常运营的；</Text>
                        <Text>4、非法截取、盗取、改变、增删系统数据、功能、程序的；</Text>
                        <Text>5、以非法目的使用账号的；</Text>
                        <Text>6、长时间不使用账号的；</Text>
                        <Text>7、其他危害或可能危害弹窝平台安全的行为。</Text>
                        <Text>（三）用户在使用平台服务的过程中，不得采取不正当手段谋取不正当利益，不得以任何名义给予干部员工回扣、返点等行为，不得以任何名义、理由向干部员工馈赠贵重礼物、现金、有价证券及代为支付应由其个人自付的各种费用（包括但不限于住宅装修、旅游度假、食宿购物等）。</Text>
                        <Text>五、账号的注销</Text>
                        <Text>（一）如您决定不再使用平台服务，您可以申请注销您本人的账号。您可以通过拨打客服热线并依照我们提示的步骤进行注销。注销时，您的账号需同时满足以下条件：</Text>
                        <Text>1、申请注销的账号不存在未结束的权利义务、未完结交易、订单和服务；</Text>
                        <Text>2、申请注销的账号无任何纠纷，包括投诉举报或被投诉举报；</Text>
                        <Text>3、自愿放弃账号在弹窝App中的资产和虚拟权益（包括但不限于账号的钱包余额、优惠券等），并确保账号中无未支付款项；</Text>
                        <Text>4、账号已经解除与其他网站、App等第三方平台的授权登录或绑定关系。</Text>
                        <Text>（二）您已充分了解，注销账号后，您将只能使用非登录状态下的平台服务。您仍会对注销账号前使用平台服务的行为承担相应的法律责任。</Text>
                        <Text>（三）账号一旦被注销将不可恢复，请您在操作之前自行备份和账号相关的所有信息和数据。请您保存好订单、合同和服务的交易凭证、票据等资料，否则您有可能需要支付额外的账户和订单查询费用，或无法享受售后服务。</Text>
                        <Text>（四）注销账号后，您将无法再使用本账号，也将无法找回您账号中及与账号相关的任何内容或信息，包括但不限于：</Text>
                        <Text>1、您将无法登录、使用本账号；</Text>
                        <Text>2、本账号的个人资料和历史信息（包括但不限于用户名、头像、交易记录、关注信息等）都将无法找回；</Text>
                        <Text>3、您通过账号使用、授权登录或绑定账号后使用的相关或第三方的其他服务的所有记录将无法找回。您将无法再登录、使用前述服务，您曾获得的余额、优惠券、积分、资格、订单及其他卡券等视为您自行放弃，将无法继续使用。您理解并同意，我们无法协助您重新恢复前述服务。请您在提交注销申请前，务必先了解您须解绑的其他相关账户信息，具体可与我们的客服联系。</Text>
                        <Text>六、服务内容</Text>
                        <Text>我们会向您提供房源信息展示、活动介绍、线上预定、签约、报修等服务，并根据业务需要、用户反馈等增加业务或功能，新增的业务或功能将自动适用本协议。预定、签约等服务不受本协议约束，我们将就该等服务另行与您签署协议。</Text>
                        <Text>七、免责声明：</Text>
                        <Text>您已经充分阅读、理解、同意并接受，鉴于网络服务之特殊性，我们无法担保以下内容，并且对以下内容不承担法律责任：</Text>
                        <Text>（一）我们不能保证提供的网络服务一定满足您的要求；</Text>
                        <Text>（二）鉴于外部网络链接指向的网页内容并非由我们实际控制，因此我们不能保证外部网络链接的真实性、安全性、准确性、完整性；</Text>
                        <Text>（三）我们不能控制网络服务因所依赖的电信设备故障、不可抗力、黑客攻击、电信部门技术调整或故障、或其他我们无法控制的原因造成弹窝平台部分或全部服务暂停、中断、无法使用、或者其他缺陷问题，但我们承诺将尽力减少因此给您造成的损失和影响。</Text>
                        <Text>（四）我们将不定期的对平台系统或提供平台服务的设备进行更新和维护。对此，我们将事先向您发送通知，由此造成的部分或全部服务的暂停、中断或无法使用，我们将不承担责任。</Text>
                        <Text>八、终止服务</Text>
                        <Text>（一）如果您希望终止本协议和平台服务，您可以选择如下之一的方式进行：</Text>
                        <Text>1、注销账号；</Text>
                        <Text>2、明确表示不接受变更后的协议、事项，并停止使用服务。</Text>
                        <Text>（二）如果我们判断您违反本协议的约定、法律法规的规定或因未履行租赁合同等违约行为被我们列入黑名单，我们将终止本协议并不再为您提供平台服务。</Text>
                        <Text>（三）您知悉并同意，本协议终止后，我们将删除您的账号（因您违反本协议或法律法规而被有关机构要求保留账号的情况除外），由此给您或任何第三人带来的损失，将由您自行承担。如您在注销账户前存在违约、侵权等不当行为或未履行完毕的合同的，您仍应承担相应责任。</Text>
                        <Text>（四）我们向您提供的预定、租赁等服务以另行签订的协议为准，本协议的终止不影响该等协议的效力。</Text>
                        <Text>九、知识产权声明</Text>
                        <Text>（一）著作权、专利权：我们在所提供的全部内容及网络服务的过程中，包含、涉及、提及的文本、图片、图形、图像、视频、软件、程序、程序代码等（统称“网站内容”）之著作权及/或专利权均受法律保护，未经相关权利人同意，任何自然人、法人或其他组织不得擅自直接或间接转载、引用、使用或者以其他方式复制、发表或发布，但法定许可的情形除外。其中属于本公司和弹窝所有之部分，必须经过我们书面授权许可。如需转载、引用、使用或者以其他方式复制、发表、发布我们平台的内容，或者磋商支付法定许可报酬，请联系我们客服热线。</Text>
                        <Text>（二）商标：“弹窝”以及弹窝图形商标是我们的商标及/或注册商标，未经我们明确书面授权擅自非法使用（包括但不限于复制、展示、传播、发送、上传、下载）的，我们将依法追究其法律责任。</Text>
                        <Text>十、法律责任</Text>
                        <Text>因您违反本协议中的承诺、保证或任何其他义务，或因您的承诺、保证不真实、不准确、不完整或具有误导性，致使我们遭受损失的，我们有权要求您赔偿全部损失并依法追究您的法律责任。如因此造成第三方损失的，您应当独立向第三方承担相应的全部赔偿责任。</Text>
                        <Text>十一、通知送达</Text>
                        <Text>（一）您有义务根据我们的要求提供您的真实资料，并保证您的通讯地址、联系电话、电子邮箱地址、紧急联系人等个人通信信息的真实性及有效性，以便我们将该等信息作为联系您的合法依据。如该等个人通信信息有变更，您有义务及时更新或直接致电我们的客服热线：进行变更。如通过您提供的个人通信信息无法联络到您，由此产生的一切损失或增加的额外费用均由您独立承担。</Text>
                        <Text>（二）您同意并接受：我们通过您提供的个人通讯信息联系您，并会定期或不定期地向您推送、告知、送达一些消息和通知。任何消息和通知于我们发出之日起，即视为已经送达用户，您不得以任何理由否认该等信息的效力或拒绝履行该等信息下用户的相应义务。对于您不想接收的推送、消息或通知，您可通过推送、消息或通知中提示的方式关闭该等功能，但因关闭该等功能而未接收到我们的消息或通知而对您造成的任何损失，将由您自行承担</Text>
                        <Text>十二、其他规定</Text>
                        <Text>（一）未成年人特别提示：如您为未成年人（未满18周岁），我们提示您，请遵守全国青少年网络文明公约，您无权单独使用我们的部分或全部功能及服务，请在父母或监护人的陪同下使用我们的服务。</Text>
                        <Text>（二）权利义务转让：在我们发生合并、分立、收购、重组、破产清算或资产转让的情况下，您同意我们有权将本协议项下部分或全部权利和义务，应上述安排的要求转让给其他相关的第三方，且无需征得您的同意</Text>
                        <Text>（三）我们未行使本协议中的任何权利，不构成对前该等权利的放弃。</Text>
                        <Text>（四）本协议中的任何条款与中华人民共和国法律强制性规定冲突导致其全部或部分无效的，不影响本协议其余条款的效力。</Text>
                        <Text>（五）除非我们终止本协议，或您根据法律法规及本协议的约定申请终止本协议并经我们同意，本协议长久有效。</Text>
                        <Text>（六）法律适用：本协议的签订、履行、变更、终止、解释均适用中华人民共和国法律。</Text>
                        <Text>（七）法律管辖：因本协议或者平台服务产生的一切纠纷及争议应向成都弹个房科技有限公司所在地的人民法院提起诉讼，法律另有规定除外。</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    serviceContainer: {
        flex: 1,
    },
    serviceBody: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15,
    }
})


export default privacyPolicy
