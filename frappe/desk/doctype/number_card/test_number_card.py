# Copyright (c) 2020, Frappe Technologies and Contributors
# License: MIT. See LICENSE
from unittest.mock import patch

import frappe
from frappe.tests import IntegrationTestCase

from frappe.desk.doctype.number_card.number_card import get_result


class TestNumberCard(IntegrationTestCase):
	def test_get_result_disables_default_ordering_for_aggregate_query(self):
		doc = {
			"document_type": "Purchase Order",
			"parent_document_type": None,
			"function": "Count",
		}

		with patch("frappe.get_list", return_value=[{"result": 3}]) as mocked_get_list:
			self.assertEqual(get_result(frappe.as_json(doc), []), 3)

		mocked_get_list.assert_called_once_with(
			"Purchase Order",
			fields=[{"COUNT": "*", "as": "result"}],
			filters=[],
			parent_doctype=None,
			order_by=None,
		)
