import { Trans } from '@lingui/macro';
import React from 'react';
import { NavLink } from 'react-router-dom';
// import { Helmet } from 'react-helmet';
import { TabPanel, Tabs } from 'react-tabs';
import Loader from '../../components/elements/Loader/Loader';
import LoadMoreTimeline from '../../components/elements/Loadmore/localInstance';
import { SuperTab, SuperTabList } from '../../components/elements/SuperTab';
import TimelineItem from '../../components/elements/TimelineItem';
import FeaturedCollections from '../../components/featuredCollections';
import FeaturedCommunities from '../../components/featuredCommunities';
import { HomeBox, MainContainer } from '../../sections/layoutUtils';
import { Flex } from 'rebass/styled-components';
import {
  Nav,
  NavItem,
  Panel,
  PanelTitle,
  WrapperPanel
} from '../../sections/panel';
import styled from '../../themes/styled';
import { Wrapper, WrapperCont } from '../communities.all/CommunitiesAll';
import { useLocalActivitiesQuery } from '../../graphql/generated/localActivities.generated';
import { useInterceptor } from '../../context/global/apolloInterceptorCtx';
import Empty from '../../components/elements/Empty';

interface Props {}

const Home: React.FC<Props> = props => {
  const { data, error, loading, fetchMore, refetch } = useLocalActivitiesQuery({
    variables: {
      limit: 15
    }
  });
  console.log('startCursor', data && data.localActivities.pageInfo.startCursor);
  console.log('endCursor', data && data.localActivities.pageInfo.endCursor);
  useInterceptor({ operation: 'createReply', request: () => () => refetch() });
  useInterceptor({ operation: 'likeComment', request: () => () => refetch() });
  useInterceptor({
    operation: 'undoLikeComment',
    request: () => () => refetch()
  });
  return (
    <MainContainer>
      <HomeBox>
        <WrapperCont>
          <WrapperFeatured>
            <FeaturedCollections />
          </WrapperFeatured>
          <WrapperFeatured mt={2}>
            <FeaturedCommunities />
          </WrapperFeatured>
          <Wrapper>
            <Tabs>
              <SuperTabList>
                <SuperTab>
                  <h5>
                    <Trans>Instance timeline</Trans>
                    {/* <Helmet>
                      <title>Instance timeline</title>
                    </Helmet> */}
                  </h5>
                </SuperTab>
              </SuperTabList>
              <TabPanel>
                {error ? (
                  <Empty>
                    <Trans>{error}</Trans>
                  </Empty>
                ) : loading ? (
                  <Loader />
                ) : (
                  <div>
                    {data!.localActivities!.nodes!.map(activity => (
                      <TimelineItem
                        node={activity!}
                        user={activity!.user!}
                        key={activity!.id!}
                      />
                    ))}
                    <LoadMoreTimeline
                      fetchMore={fetchMore}
                      localActivities={data!.localActivities!}
                    />
                  </div>
                )}
              </TabPanel>
            </Tabs>
          </Wrapper>
        </WrapperCont>
      </HomeBox>
      <WrapperPanel>
        <Panel>
          <PanelTitle fontSize={0} fontWeight={'bold'}>
            <Trans>Browse Home instance</Trans>
          </PanelTitle>
          <Nav>
            <NavItem mb={4} fontSize={1} fontWeight={'bold'}>
              <NavLink to="/communities">
                <Trans>All communities</Trans>
              </NavLink>
            </NavItem>
            <NavItem fontSize={1} fontWeight={'bold'}>
              <NavLink to="/collections">
                <Trans>All collections</Trans>
              </NavLink>
            </NavItem>
          </Nav>
        </Panel>

        <Panel>
          <PanelTitle fontSize={0} fontWeight={'bold'}>
            <Trans>Popular hashtags: network</Trans>
          </PanelTitle>
          <Nav>
            <NavItem mb={3} fontSize={1}>
              <Trans>#learningdesign</Trans>
            </NavItem>
            <NavItem mb={3} fontSize={1}>
              <Trans>#MPI</Trans>
            </NavItem>
            <NavItem mb={3} fontSize={1}>
              <Trans>#Youtube</Trans>
            </NavItem>
            <NavItem mb={3} fontSize={1}>
              <Trans>#models</Trans>
            </NavItem>
            <NavItem mb={3} fontSize={1}>
              <Trans>#ADDIE</Trans>
            </NavItem>
          </Nav>
        </Panel>

        <Panel>
          <PanelTitle fontSize={0} fontWeight={'bold'}>
            <Trans>Popular hashtags: local instance</Trans>
          </PanelTitle>
          <Nav>
            <NavItem mb={3} fontSize={1}>
              <Trans>#learningdesign</Trans>
            </NavItem>
            <NavItem mb={3} fontSize={1}>
              <Trans>#MPI</Trans>
            </NavItem>
            <NavItem mb={3} fontSize={1}>
              <Trans>#Youtube</Trans>
            </NavItem>
            <NavItem mb={3} fontSize={1}>
              <Trans>#models</Trans>
            </NavItem>
            <NavItem mb={3} fontSize={1}>
              <Trans>#ADDIE</Trans>
            </NavItem>
          </Nav>
        </Panel>
      </WrapperPanel>
    </MainContainer>
  );
};

const WrapperFeatured = styled(Flex)`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export default Home;