import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";
import Link from "next/link";
import Layout from "../../../../components/layout";
import Campaign from "../../../../ethereum/campaign";
import RequestRow from "../../../../components/RequestRow";

class RequestIndex extends Component {
  static async getInitialProps(context) {
    const { campaign } = context.query;
    const campaignContract = Campaign(campaign);
    const requestCount = await campaignContract.methods
      .getRequestCount()
      .call();
    const approversCount = await campaignContract.methods
      .approversCount()
      .call();

    const requests = await Promise.all(
      Array(parseInt(requestCount))
        .fill()
        .map((element, index) => {
          return campaignContract.methods.requests(index).call();
        })
    );

    return { address: campaign, requests, requestCount, approversCount };
  }

  renderRow() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={this.props.address}
          approversCount={this.props.approversCount}
        />
      );
    });
  }

  render() {
    //destructure Table.Header, Table.Row, Table.HeaderCell, Table.Body from Table
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <h3>Request</h3>
        <Link
          href="/campaigns/[campaign]/requests/new"
          as={`/campaigns/${this.props.address}/requests/new`}
        >
          <a>
            <Button primary floated="right" style={{ marginBottom: 10 }}>
              Add request
            </Button>
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>ApprovalCount</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>

          <Body>{this.renderRow()}</Body>
        </Table>
        <div>Found {this.props.requestCount} requests.</div>
      </Layout>
    );
  }
}

export default RequestIndex;
