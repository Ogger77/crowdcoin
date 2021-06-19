import React, { Component } from "react";
import { Card, Grid, Button } from "semantic-ui-react";
import Link from "next/link";

import web3 from "../../ethereum/web3";
import Layout from "../../components/layout";
import Campaign from "../../ethereum/campaign";
import ContributionForm from "../../components/ContributeForm";

class CampaignShow extends Component {
  static async getInitialProps(context) {
    const campaign = Campaign(context.query.campaign);

    const summary = await campaign.methods.getSummary().call();

    return {
      address: context.query.campaign,
      minimumContribution: summary[0],
      balance: summary[1],
      requestCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    };
  }

  renderCard() {
    const {
      balance,
      manager,
      minimumContribution,
      requestCount,
      approversCount,
    } = this.props;

    const items = [
      {
        header: manager,
        meta: "Address of manager",
        description:
          "The manager created this campaign and can reate requests to withdraw money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description:
          "You must contribute at least this much wei to become an approver",
      },
      {
        header: requestCount,
        meta: "Number of Requests",
        description:
          "A request tries to withdraw money from the contract. Requests must be approved by approvers",
      },
      {
        header: approversCount,
        meta: "Number of approvers",
        description:
          "Number of people who have already donated to this campaign",
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (ether)",
        description:
          "The balance is how much money this campaign has left to spend",
      },
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Campaign Show</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCard()}</Grid.Column>

            <Grid.Column width={6}>
              <ContributionForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Link
                href="/campaigns/[campaign]/requests"
                as={`/campaigns/${this.props.address}/requests`}
              >
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
