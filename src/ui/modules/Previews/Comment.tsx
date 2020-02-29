import React from 'react';
import styled from 'ui/themes/styled';
import { Box, Text, Flex } from 'rebass/styled-components';
import SocialText from 'ui/modules/SocialText';
import { i18nMark, Trans } from '@lingui/react';
import { LocaleContext } from '../../../context/global/localizationCtx';
import { FormikHook } from 'ui/@types/types';
import { MessageCircle, Star } from 'react-feather';

import Modal from 'ui/modules/Modal';

export interface LikeActions {
  toggleLikeFormik: FormikHook<{}>;
  totalLikes: number;
  iLikeIt: boolean;
}
export interface ReplyActions {
  replyFormik: FormikHook<{ replyMessage: string }>;
}
export interface CommentProps {
  FlagModal: null | React.ComponentType<{ done(): unknown }>;
  like: LikeActions;
  reply: ReplyActions;
  content: string;
}

const tt = {
  placeholders: {
    name: i18nMark('Post a reply'),
    summary: i18nMark(
      'Please describe what the collection is for and what kind of resources it is likely to contain...'
    ),
    image: i18nMark('Enter the URL of an image to represent the collection')
  }
};

export const Comment: React.SFC<CommentProps> = ({
  content,
  reply,
  like,
  FlagModal
}) => {
  const [talkModalVisible, showTalkModal] = React.useState(false);
  const { i18n } = React.useContext(LocaleContext);
  const [isOpenFlagModal, setOpenFlagModal] = React.useState(false);
  return (
    <Wrapper>
      <Text variant="text" p={2}>
        {content}
      </Text>
      <Actions>
        {talkModalVisible && (
          <SocialText
            placeholder={i18n._(tt.placeholders.name)}
            defaultValue={''}
            submit={msg => {
              showTalkModal(false);
              reply.replyFormik.setValues({ replyMessage: msg });
              reply.replyFormik.submitForm();
            }}
          />
        )}
        <Box>
          <Items>
            <ActionItem onClick={() => showTalkModal(!talkModalVisible)}>
              <ActionIcon>
                <MessageCircle
                  className="hover"
                  strokeWidth="1"
                  color="rgba(0,0,0,.4)"
                  size="20"
                />
              </ActionIcon>
              <Text
                ml={1}
                variant={'suptitle'}
                sx={{ textTransform: 'capitalize' }}
              >
                <Trans>Comment</Trans>
              </Text>
            </ActionItem>
            <ActionItem onClick={like.toggleLikeFormik.submitForm}>
              <ActionIcon>
                <Star
                  className="hover"
                  color={like.iLikeIt ? '#ED7E22' : 'rgba(0,0,0,.4)'}
                  strokeWidth="1"
                  size="20"
                />
              </ActionIcon>
              <Text
                variant={'suptitle'}
                sx={{ textTransform: 'capitalize' }}
                ml={1}
              >
                {like.totalLikes + ' '} <Trans>Favourite</Trans>
              </Text>
            </ActionItem>
          </Items>
          {FlagModal && isOpenFlagModal && (
            <Modal closeModal={() => setOpenFlagModal(false)}>
              <FlagModal done={() => setOpenFlagModal(false)} />
            </Modal>
          )}
        </Box>
      </Actions>
    </Wrapper>
  );
};

const Items = styled(Flex)`
  flex: 1;
  justify-content: space-around;
`;

const Actions = styled(Box)`
  position: relative;
  z-index: 999999999999999999999999999999999999;
  border-top: 1px solid #dadada;
  padding: 8px;
`;

const ActionItem = styled(Flex)`
  align-items: center;
  color: ${props => props.theme.colors.gray};
  cursor: pointer;
  a {
    display: flex;
    align-items: center;
    position: relative;
    z-index: 9;
  }
  &:hover {
    svg.hover {
      stroke: ${props => props.theme.colors.orange};
    }
  }
`;

const ActionIcon = styled(Box)`
  width: 30px;
  height: 30px;
  border-radius: 99999px;
  display: inline-flex;
  align-items: center;
  align-content: center;
  text-align: center;
  margin-left: -8px;
  svg {
    margin: 0 auto;
  }
`;

const Wrapper = styled(Box)`
  border: 1px solid ${props => props.theme.colors.lightgray};
  border-radius: 4px;
`;
