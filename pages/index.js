import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";
import factory from "../ethereum/factory";
import Layout from "../components/layout";
import Link from "next/link";

class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();

    return { campaigns };
  }

  renderCampaigns() {
    const items = this.props.campaigns.map((campaign) => {
      return {
        header: campaign,
        description: (
          <Link href="/campaigns/[campaign]" as={`/campaigns/${campaign}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
        style: {
          marginLeft: "0",
        },
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Open Campaign</h3>
          <Link href="/campaigns/new">
            <a>
              <Button
                floated="right"
                content="Create Campaign"
                icon="add"
                primary
              />
            </a>
          </Link>

          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
