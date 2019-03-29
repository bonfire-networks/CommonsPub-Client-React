import * as React from 'react';
import compose from 'recompose/compose';
import { graphql, GraphqlQueryControls, OperationOption } from 'react-apollo';
import { Trans } from '@lingui/macro';
import styled from '../../themes/styled';
import Collection from '../../types/Collection';
import Loader from '../../components/elements/Loader/Loader';
import CollectionCard from '../../components/elements/Collection/Collection';
import CollectionsLoadMore from '../../components/elements/Loadmore/followingCollections';

const {
  getFollowedCollections
} = require('../../graphql/getFollowedCollections.graphql');

interface Data extends GraphqlQueryControls {
  me: {
    user: {
      followingCollections: {
        edges: any[];
        pageInfo: {
          startCursor: number;
          endCursor: number;
        };
      };
    };
  };
}

interface Props {
  data: Data;
}

class CommunitiesYours extends React.Component<Props> {
  render() {
    return this.props.data.error ? (
      <span>
        <Trans>Error loading collections</Trans>
      </span>
    ) : this.props.data.loading ? (
      <Loader />
    ) : (
      <ListWrapper>
        <List>
          {this.props.data.me.user.followingCollections.edges.map((comm, i) => (
            <CollectionCard
              key={i}
              collection={comm.node}
              communityId={comm.node.localId}
            />
          ))}
        </List>
        <CollectionsLoadMore
          fetchMore={this.props.data.fetchMore}
          collections={this.props.data.me.user.followingCollections}
          me
        />
      </ListWrapper>
    );
  }
}

const ListWrapper = styled.div`
  padding: 16px;
`;

const List = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  padding-top: 0;
`;

const withGetCommunities = graphql<
  {},
  {
    data: {
      followingCollections: Collection[];
    };
  }
>(getFollowedCollections) as OperationOption<{}, {}>;

export default compose(withGetCommunities)(CommunitiesYours);