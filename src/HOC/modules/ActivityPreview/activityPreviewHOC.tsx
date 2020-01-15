import React, { useMemo } from 'react';
import * as GQL from './getActivityPreview.generated';
import { Activity } from 'graphql/types.generated';
import * as UI from 'ui/modules/ActivityPreview';
import { SFC } from 'react';
import * as UIT from 'ui/modules/ActivityPreview/types';
import { useFormik } from 'formik';

export interface Props {
  activityId: Activity['id'];
}
export const ActivityPreviewHOC: SFC<Props> = ({ activityId }) => {
  const activityQ = GQL.useGetActivityPreviewQuery({
    variables: { activityId }
  });
  const [likeMut, likeMutStatus] = GQL.useActivityPreviewLikeMutation();
  const [unlikeMut, unlikeMutStatus] = GQL.useActivityPreviewUnlikeMutation();
  const [
    createThreadMut,
    createThreadMutStatus
  ] = GQL.useActivityPreviewCreateThreadMutation();
  const [
    createReplyMut,
    createReplyMutStatus
  ] = GQL.useActivityPreviewCreateReplyMutation();

  const activity = activityQ.data && activityQ.data.activity;
  const replyFormik = useFormik<{ replyMessage: string }>({
    initialValues: { replyMessage: '' },
    onSubmit: ({ replyMessage }) => {
      if (
        !activity ||
        createReplyMutStatus.loading ||
        createThreadMutStatus.loading
      ) {
        return;
      } else if (activity.context.__typename === 'Comment') {
        const { thread, id } = activity.context;
        return createReplyMut({
          variables: {
            threadId: thread.id,
            inReplyToId: id,
            comment: { content: replyMessage }
          }
        });
      } else {
        return createThreadMut({
          variables: {
            contextId: activity.id,
            comment: { content: replyMessage }
          }
        });
      }
    }
  });
  const toggleLikeFormik = useFormik<{}>({
    initialValues: {},
    onSubmit: () => {
      if (
        !activity ||
        'Like' === activity.context.__typename ||
        'Flag' === activity.context.__typename ||
        'Follow' === activity.context.__typename ||
        likeMutStatus.loading ||
        unlikeMutStatus.loading
      ) {
        return;
      } else {
        const { myLike } = activity.context;
        if (myLike) {
          return unlikeMut({ variables: { contextId: myLike.id } });
        } else {
          return likeMut({ variables: { contextId: activity.id } });
        }
      }
    }
  });

  const props = useMemo<UI.Props>(
    () => {
      if (!activity) {
        return {
          activity: {
            status: UIT.Status.Loading
          }
        };
      } else {
        let props: UI.Props;
        switch (activity.context.__typename) {
          case 'Comment': {
            props = {
              activity: {
                status: UIT.Status.Loaded,
                context: {
                  ...BaseCtxBuilder(activity),
                  ...withLike(activity.context),
                  toggleLikeFormik,
                  msgContent: activity.context.content,
                  contextType: UIT.ContextType.Comment,
                  link: getSimpleLink(activity.context.thread),
                  replyFormik
                }
              }
            };
            break;
          }
          case 'Resource': {
            props = {
              activity: {
                status: UIT.Status.Loaded,
                context: {
                  ...BaseCtxBuilder(activity),
                  ...withLike(activity.context),
                  toggleLikeFormik,
                  replyFormik,
                  concrete: true,
                  contextType: UIT.ContextType.Resource,
                  icon: activity.context.icon || '',
                  link: getSimpleLink(activity.context.collection),
                  title: activity.context.name
                }
              }
            };
            break;
          }
          case 'Collection': {
            props = {
              activity: {
                status: UIT.Status.Loaded,
                context: {
                  ...BaseCtxBuilder(activity),
                  ...withLike(activity.context),
                  toggleLikeFormik,
                  replyFormik,
                  concrete: true,
                  contextType: UIT.ContextType.Collection,
                  icon: activity.context.icon || '',
                  link: getSimpleLink(activity.context),
                  title: activity.context.name
                }
              }
            };
            break;
          }
          case 'Community': {
            props = {
              activity: {
                status: UIT.Status.Loaded,
                context: {
                  ...BaseCtxBuilder(activity),
                  ...withLike(activity.context),
                  toggleLikeFormik,
                  replyFormik,
                  concrete: true,
                  contextType: UIT.ContextType.Community,
                  icon: activity.context.icon || '',
                  link: getSimpleLink(activity.context),
                  title: activity.context.name
                }
              }
            };
            break;
          }
          case 'Like': {
            const linkCtx =
              activity.context.context.__typename === 'Comment'
                ? activity.context.context.thread
                : activity.context.context.__typename === 'User'
                  ? {
                      ...activity.context.context,
                      id: activity.context.context.userId
                    }
                  : activity.context.context.__typename === 'Resource'
                    ? activity.context.context.collection
                    : activity.context.context;
            props = {
              activity: {
                status: UIT.Status.Loaded,
                context: {
                  ...BaseCtxBuilder(activity),
                  contextType: UIT.ContextType.Like,
                  link: getSimpleLink(linkCtx),
                  replyFormik
                }
              }
            };
            break;
          }
          case 'Follow': {
            const linkCtx =
              activity.context.context.__typename === 'User'
                ? {
                    ...activity.context.context,
                    id: activity.context.context.userId
                  }
                : activity.context.context;
            props = {
              activity: {
                status: UIT.Status.Loaded,
                context: {
                  ...BaseCtxBuilder(activity),
                  contextType: UIT.ContextType.Follow,
                  link: getSimpleLink(linkCtx),
                  replyFormik
                }
              }
            };
            break;
          }
          case 'Flag': {
            const linkCtx =
              activity.context.context.__typename === 'Comment'
                ? activity.context.context.thread
                : activity.context.context.__typename === 'User'
                  ? {
                      ...activity.context.context,
                      id: activity.context.context.userId
                    }
                  : activity.context.context.__typename === 'Resource'
                    ? activity.context.context.collection
                    : activity.context.context;
            props = {
              activity: {
                status: UIT.Status.Loaded,
                context: {
                  ...BaseCtxBuilder(activity),
                  contextType: UIT.ContextType.Flag,
                  link: getSimpleLink(linkCtx),
                  replyFormik
                }
              }
            };
            break;
          }
        }
        return props;
      }
    },
    [activity]
  );
  return <UI.ActivityPreview {...props} />;
};

type ConcreteContext =
  | GQL.ActivityPreviewCommentCtxExtendedFragment
  | GQL.ActivityPreviewResourceCtxFragment
  | GQL.ActivityPreviewCollectionCtxFragment
  | GQL.ActivityPreviewCommunityCtxFragment;

type SimpleContext =
  | GQL.ActivityPreviewLikeCtxFragment
  | GQL.ActivityPreviewFollowCtxFragment
  | GQL.ActivityPreviewFlagCtxFragment;
const isSimpleContext = (
  context: NoMaybeActivity['context']
): context is SimpleContext =>
  context.__typename === 'Flag' ||
  context.__typename === 'Like' ||
  context.__typename === 'Follow';

type NoMaybeActivity = Exclude<GQL.GetActivityPreviewQuery['activity'], null>;
const BaseCtxBuilder = (
  activity: NoMaybeActivity
): Omit<UIT.BaseActivity, 'replyFormik' | 'link'> => {
  const { user, createdAt, verb, context } = activity;
  return {
    actor: getActor(user),
    contextType: UIT.ContextType[context.__typename],
    createdAt,
    inReplyToContext: inReplyToContext(activity),
    replies: 0,
    verb
  };
};
const inReplyToContext = (
  activity: NoMaybeActivity
): UIT.BaseActivity['inReplyToContext'] => {
  if (
    !(
      isSimpleContext(activity.context) ||
      activity.context.__typename === 'Comment'
    ) ||
    (activity.context.__typename === 'Comment' && !activity.context.inReplyTo)
  ) {
    return null;
  }
  const ctx =
    activity.context.__typename === 'Comment'
      ? activity.context.thread
      : activity.context.context.__typename === 'Resource'
        ? activity.context.context.collection
        : activity.context.context;
  if (ctx.__typename === 'Comment') {
    return null;
  }
  const link = getSimpleLink({
    ...ctx,
    id: ctx.__typename === 'User' ? ctx.userId : ctx.id
  });
  const inReplyContextCtx = {
    link
  };

  const actor = 'creator' in ctx ? getActor(ctx.creator) : null;

  return {
    actor,
    context: inReplyContextCtx,
    type: getContextType('Collection')
  };
  //context.__typename
};
const getContextType = (
  type: NoMaybeActivity['context']['__typename']
): UIT.ContextType => {
  switch (type) {
    case 'Comment':
      return UIT.ContextType.Comment;
    case 'Resource':
      return UIT.ContextType.Resource;
    case 'Collection':
      return UIT.ContextType.Collection;
    case 'Community':
      return UIT.ContextType.Community;
    case 'Like':
      return UIT.ContextType.Like;
    case 'Follow':
      return UIT.ContextType.Follow;
    case 'Flag':
      return UIT.ContextType.Flag;
  }
};
const getActor = (usr: GQL.ActivityPreviewBaseUserFragment): UIT.Actor => {
  return {
    icon: usr.icon || usr.image || '',
    name: usr.userName || '',
    preferredUsername: usr.preferredUsername,
    link: getSimpleLink({ ...usr, id: usr.userId })
  };
};

const linkPathMap = {
  User: 'user',
  Community: 'communities',
  // Resource: 'resource',
  Thread: 'thread',
  Collection: 'collections'
};

const getSimpleLink = ({
  __typename,
  isLocal,
  id,
  canonicalUrl
}: {
  __typename: keyof typeof linkPathMap;
  isLocal: boolean;
  id: string;
  canonicalUrl?: string | null | undefined;
}) =>
  isLocal
    ? {
        external: false,
        url: `/${linkPathMap[__typename]}/${id}`
      }
    : {
        external: true,
        url: canonicalUrl || ''
      };

const withLike = (
  ctx: ConcreteContext
): Omit<UIT.WithLike, 'toggleLikeFormik'> => {
  const totalLikes =
    ctx.__typename === 'Community' ? null : ctx.likes.totalCount;
  return {
    iLikeIt: !!ctx.myLike,
    totalLikes
  };
};
